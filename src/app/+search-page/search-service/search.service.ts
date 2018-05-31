import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationExtras, PRIMARY_OUTLET, Router, UrlSegmentGroup } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { flatMap, map, tap } from 'rxjs/operators';
import { ViewMode } from '../../+search-page/search-options.model';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { SortDirection, SortOptions } from '../../core/cache/models/sort-options.model';
import {
  FacetConfigSuccessResponse,
  FacetValueSuccessResponse,
  SearchSuccessResponse
} from '../../core/cache/response-cache.models';
import { ResponseCacheEntry } from '../../core/cache/response-cache.reducer';
import { ResponseCacheService } from '../../core/cache/response-cache.service';
import { PaginatedList } from '../../core/data/paginated-list';
import { ResponseParsingService } from '../../core/data/parsing.service';
import { RemoteData } from '../../core/data/remote-data';
import { GetRequest, RestRequest } from '../../core/data/request.models';
import { RequestService } from '../../core/data/request.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { configureRequest } from '../../core/shared/operators';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import { hasValue, isNotEmpty } from '../../shared/empty.util';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { NormalizedSearchResult } from '../normalized-search-result.model';
import { SearchOptions } from '../search-options.model';
import { SearchResult } from '../search-result.model';
import { FacetValue } from './facet-value.model';
import { SearchFilterConfig } from './search-filter-config.model';
import { SearchResponseParsingService } from '../../core/data/search-response-parsing.service';
import { SearchQueryResponse } from './search-query-response.model';
import { PageInfo } from '../../core/shared/page-info.model';
import { getSearchResultFor } from './search-result-element-decorator';
import { ListableObject } from '../../shared/object-collection/shared/listable-object.model';
import { FacetValueResponseParsingService } from '../../core/data/facet-value-response-parsing.service';
import { FacetConfigResponseParsingService } from '../../core/data/facet-config-response-parsing.service';
import { PaginatedSearchOptions } from '../paginated-search-options.model';
import { MYDSPACE_ROUTE } from '../../+my-dspace-page/my-dspace-page.component';
import { MyDSpaceResponseParsingService } from '../../core/data/mydspace-response-parsing.service';
import { RouteService } from '../../shared/services/route.service';

@Injectable()
export class SearchService implements OnDestroy {
  private searchLinkPath = 'discover/search/objects';
  private facetValueLinkPathPrefix = 'discover/facets/';
  private facetConfigLinkPath = 'discover/facets';

  private forceBypassCache = false;
  private parser: GenericConstructor<ResponseParsingService> = SearchResponseParsingService;
  private sub;

  searchOptions: SearchOptions;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private routeService: RouteService,
              protected responseCache: ResponseCacheService,
              protected requestService: RequestService,
              private rdb: RemoteDataBuildService,
              private halService: HALEndpointService) {
    const pagination: PaginationComponentOptions = new PaginationComponentOptions();
    pagination.id = 'search-results-pagination';
    pagination.currentPage = 1;
    pagination.pageSize = 10;
    const sort: SortOptions = new SortOptions('score', SortDirection.DESC);
    this.searchOptions = Object.assign(new SearchOptions(), {pagination: pagination, sort: sort});
  }

  setServiceOptions(parser: GenericConstructor<ResponseParsingService>, forceBypassCache: boolean) {
    if (parser) {
      this.parser = parser;
    }
    this.forceBypassCache = forceBypassCache;
  }

  search(searchOptions?: PaginatedSearchOptions): Observable<RemoteData<PaginatedList<SearchResult<DSpaceObject>>>> {
    const requestObs = this.halService.getEndpoint(this.searchLinkPath).pipe(
      map((url: string) => {
        if (hasValue(searchOptions)) {
          url = (searchOptions as PaginatedSearchOptions).toRestUrl(url);
        }
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        const getResponseParserFn: () => GenericConstructor<ResponseParsingService> = () => {
          return this.parser;
        };

        return Object.assign(request, {
          getResponseParser: getResponseParserFn
        });
      }),
      configureRequest(this.requestService, this.forceBypassCache)
    );
    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const responseCacheObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.responseCache.get(request.href))
    );

    // get search results from response cache
    const sqrObs: Observable<SearchQueryResponse> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: SearchSuccessResponse) => response.results)
    );

    // turn dspace href from search results to effective list of DSpaceObjects
    // Turn list of observable remote data DSO's into observable remote data object with list of DSO
    const dsoObs: Observable<RemoteData<DSpaceObject[]>> = sqrObs.pipe(
      map((sqr: SearchQueryResponse) => {
        return sqr.objects.map((nsr: NormalizedSearchResult) =>
          this.rdb.buildSingle(nsr.dspaceObject));
      }),
      flatMap((input: Array<Observable<RemoteData<DSpaceObject>>>) => this.rdb.aggregate(input))
    );

    // Create search results again with the correct dso objects linked to each result
    const tDomainListObs = Observable.combineLatest(sqrObs, dsoObs, (sqr: SearchQueryResponse, dsos: RemoteData<DSpaceObject[]>) => {

      return sqr.objects.map((object: NormalizedSearchResult, index: number) => {
        let co = DSpaceObject;
        if (dsos.payload[index]) {
          const constructor: GenericConstructor<ListableObject> = dsos.payload[index].constructor as GenericConstructor<ListableObject>;
          co = getSearchResultFor(constructor, searchOptions.configuration);
          return Object.assign(new co(), object, {
            dspaceObject: dsos.payload[index]
          });
        } else {
          return undefined;
        }
      });
    });

    const pageInfoObs: Observable<PageInfo> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: FacetValueSuccessResponse) => response.pageInfo)
    );

    const payloadObs = Observable.combineLatest(tDomainListObs, pageInfoObs, (tDomainList, pageInfo) => {
      return new PaginatedList(pageInfo, tDomainList);
    });

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, payloadObs);
  }

  getConfig(scope?: string, configuration?: string): Observable<RemoteData<SearchFilterConfig[]>> {
    const requestObs = this.halService.getEndpoint(this.facetConfigLinkPath).pipe(
      map((url: string) => {
        const args: string[] = [];

        if (isNotEmpty(scope)) {
          args.push(`scope=${scope}`);
        }

        // const configurationValue = configuration || 'default';
        if (isNotEmpty(configuration)) {
        args.push(`configuration=${configuration}`);
        }

        if (isNotEmpty(args)) {
          url = new URLCombiner(url, `?${args.join('&')}`).toString();
        }

        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return FacetConfigResponseParsingService;
          }
        });
      }),
      configureRequest(this.requestService, this.forceBypassCache)
    );

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const responseCacheObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.responseCache.get(request.href))
    );

    // get search results from response cache
    const facetConfigObs: Observable<SearchFilterConfig[]> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: FacetConfigSuccessResponse) =>
        response.results.map((result: any) => Object.assign(new SearchFilterConfig(), result)))
    );

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, facetConfigObs);
  }

  getFacetValuesFor(filterConfig: SearchFilterConfig, valuePage: number, searchOptions?: SearchOptions): Observable<RemoteData<PaginatedList<FacetValue>>> {
    const requestObs = this.halService.getEndpoint(this.facetValueLinkPathPrefix + filterConfig.name).pipe(
      map((url: string) => {
        const args: string[] = [`page=${valuePage - 1}`, `size=${filterConfig.pageSize}`];
        // searchOptions.configuration = 'workspace';
        if (hasValue(searchOptions)) {
          url = searchOptions.toRestUrl(url, args);
        }
        const request = new GetRequest(this.requestService.generateRequestId(), url);
        return Object.assign(request, {
          getResponseParser(): GenericConstructor<ResponseParsingService> {
            return FacetValueResponseParsingService;
          }
        });
      }),
      configureRequest(this.requestService, this.forceBypassCache)
    );

    const requestEntryObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.requestService.getByHref(request.href))
    );

    const responseCacheObs = requestObs.pipe(
      flatMap((request: RestRequest) => this.responseCache.get(request.href))
    );

    // get search results from response cache
    const facetValueObs: Observable<FacetValue[]> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: FacetValueSuccessResponse) => response.results)
    );

    const pageInfoObs: Observable<PageInfo> = responseCacheObs.pipe(
      map((entry: ResponseCacheEntry) => entry.response),
      map((response: FacetValueSuccessResponse) => response.pageInfo)
    );

    const payloadObs = Observable.combineLatest(facetValueObs, pageInfoObs, (facetValue, pageInfo) => {
      return new PaginatedList(pageInfo, facetValue);
    });

    return this.rdb.toRemoteDataObservable(requestEntryObs, responseCacheObs, payloadObs);
  }

  getViewMode(): Observable<ViewMode> {
    return this.routeService.getQueryParameterValue('view')
      .map((view) => {
        if (isNotEmpty(view) && hasValue(view)) {
          return view as ViewMode;
        } else {
          return ViewMode.List;
        }
      });
  }

  setViewMode(viewMode: ViewMode) {
    this.sub = this.routeService.getQueryParamMap()
      .map((paramMap) => paramMap.params)
      .distinctUntilChanged()
      .take(1)
      .subscribe((params) => {
        const newParams = Object.create({});
        Object.keys(params)
          .filter((paramKey) => paramKey !== 'pageId' && paramKey !== 'page' && paramKey !== 'pageSize')
          .forEach((paramKey) => newParams[paramKey] = params[paramKey]);

        newParams.view = viewMode;

        const navigationExtras: NavigationExtras = {
          queryParams: newParams
        };

        this.router.navigate([this.getSearchLink()], navigationExtras);
      })
  }

  getSearchLink(): string {
    const urlTree = this.router.parseUrl(this.router.url);
    const g: UrlSegmentGroup = urlTree.root.children[PRIMARY_OUTLET];
    return '/' + g.toString();
  }

  ngOnDestroy(): void {
    if (this.sub !== undefined) {
      this.sub.unsubscribe();
    }
  }
}