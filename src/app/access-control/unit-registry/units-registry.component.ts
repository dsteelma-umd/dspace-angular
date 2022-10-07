import { Component, OnDestroy, OnInit } from '@angular/core';
import { hasValue } from 'src/app/shared/empty.util';
import {
  BehaviorSubject,
  combineLatest as observableCombineLatest,
  Observable,
  of as observableOf,
  Subscription
} from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { buildPaginatedList, PaginatedList } from 'src/app/core/data/paginated-list.model';
import { PageInfo } from 'src/app/core/shared/page-info.model';
import { Unit } from 'src/app/core/eperson/models/unit.model';
import { PaginationComponentOptions } from 'src/app/shared/pagination/pagination-component-options.model';
import { TranslateService } from '@ngx-translate/core';
import { UnitDtoModel } from 'src/app/core/eperson/models/unit-dto.model';
import { PaginationService } from 'src/app/core/pagination/pagination.service';
import { UnitDataService } from 'src/app/core/eperson/unit-data.service';
import { followLink } from 'src/app/shared/utils/follow-link-config.model';
import { getAllSucceededRemoteData, getRemoteDataPayload } from 'src/app/core/shared/operators';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { FeatureID } from 'src/app/core/data/feature-authorization/feature-id';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'ds-units-registry',
  templateUrl: './units-registry.component.html',
  styleUrls: ['./units-registry.component.scss']
})
export class UnitsRegistryComponent implements OnInit, OnDestroy {

  messagePrefix = 'admin.access-control.units.';

  /**
   * Pagination config used to display the list of groups
   */
  config: PaginationComponentOptions = Object.assign(new PaginationComponentOptions(), {
    id: 'ul',
    pageSize: 5,
    currentPage: 1
  });

  /**
   * A BehaviorSubject with the list of UnitDtoModel objects made from the Units in the repository or
   * as the result of the search
   */
  unitsDto$: BehaviorSubject<PaginatedList<UnitDtoModel>> = new BehaviorSubject<PaginatedList<UnitDtoModel>>({} as any);
  deletedUnitsIds: string[] = [];

  // Current search in units registry
  currentSearchQuery: string;

  /**
   * The subscription for the search method
   */
  searchSub: Subscription;

  // paginationSub: Subscription;

  /**
   * List of subscriptions
   */
   subs: Subscription[] = [];

  /**
   * An observable for the pageInfo, needed to pass to the pagination component
   */
  pageInfoState$: BehaviorSubject<PageInfo> = new BehaviorSubject<PageInfo>(undefined);

  // The search form
  searchForm;

  /**
   * A boolean representing if a search is pending
   */
  loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public unitService: UnitDataService,
              private translateService: TranslateService,
              private formBuilder: FormBuilder,
              private authorizationService: AuthorizationDataService,
              private paginationService: PaginationService,) {
    this.currentSearchQuery = '';
    this.searchForm = this.formBuilder.group(({
      query: this.currentSearchQuery,
    }));
  }

  ngOnInit(): void {
    this.search({ query: this.currentSearchQuery });
  }


  /**
   * Search in the units (searches by unit name and by uuid exact match)
   * @param data  Contains query param
   */
  search(data: any) {
    if (hasValue(this.searchSub)) {
      this.searchSub.unsubscribe();
      this.subs = this.subs.filter((sub: Subscription) => sub !== this.searchSub);
    }

    this.searchSub = this.paginationService.getCurrentPagination(this.config.id, this.config).pipe(
      tap(() => this.loading$.next(true)),
      switchMap((paginationOptions) => {
        const query: string = data.query;
        if (query != null && this.currentSearchQuery !== query) {
          this.currentSearchQuery = query;
          this.paginationService.updateRouteWithUrl(this.config.id, [], {page: 1});
        }
        return this.unitService.searchUnits(this.currentSearchQuery.trim(), {
          currentPage: paginationOptions.currentPage,
          elementsPerPage: paginationOptions.pageSize,
        }, true, true, followLink('groups'));
      }),
      getAllSucceededRemoteData(),
      getRemoteDataPayload(),
      switchMap((units: PaginatedList<Unit>) => {
        if (units.page.length === 0) {
          return observableOf(buildPaginatedList(units.pageInfo, []));
        }
        return this.authorizationService.isAuthorized(FeatureID.AdministratorOf).pipe(
          switchMap((isSiteAdmin: boolean) => {
            return observableCombineLatest(units.page.map((unit: Unit) => {
              if (hasValue(unit) && !this.deletedUnitsIds.includes(unit.id)) {
                return observableCombineLatest([
                  this.authorizationService.isAuthorized(FeatureID.CanDelete, unit.self),
//                  this.canManageGroup$(isSiteAdmin, group),
//                  this.hasLinkedDSO(group),
//                  this.getSubgroups(group),
//                  this.getMembers(group)
                ]).pipe(
                  map(([canDelete/*, canManageGroup, hasLinkedDSO, subgroups, members*/]:
                         [boolean/*, boolean, boolean, RemoteData<PaginatedList<Group>>, RemoteData<PaginatedList<EPerson>>*/]) => {
//                      const groupDtoModel: GroupDtoModel = new GroupDtoModel();
//                      groupDtoModel.ableToDelete = canDelete && !hasLinkedDSO;
//                      groupDtoModel.ableToEdit = canManageGroup;
//                      groupDtoModel.group = group;
//                      groupDtoModel.subgroups = subgroups.payload;
//                      groupDtoModel.epersons = members.payload;
                      const unitDtoModel: UnitDtoModel = new UnitDtoModel();
                      unitDtoModel.ableToDelete = canDelete;
                      unitDtoModel.unit = unit;
                      return unitDtoModel;
                    }
                  )
                );
              }
            })).pipe(map((dtos: UnitDtoModel[]) => {
              return buildPaginatedList(units.pageInfo, dtos);
            }));
          })
        );
      })
    ).subscribe((value: PaginatedList<UnitDtoModel>) => {
      this.unitsDto$.next(value);
      this.pageInfoState$.next(value.pageInfo);
      this.loading$.next(false);
    });

    this.subs.push(this.searchSub);
  }

  /**
   * Reset all input-fields to be empty and search all search
   */
   clearFormAndResetResult() {
    this.searchForm.patchValue({
      query: '',
    });
    this.search({ query: '' });
  }

  /**
   * Unsub all subscriptions
   */
   ngOnDestroy(): void {
    this.cleanupSubscribes();
    this.paginationService.clearPagination(this.config.id);
  }


  cleanupSubscribes() {
    // if (hasValue(this.paginationSub)) {
    //   this.paginationSub.unsubscribe();
    // }
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
    this.paginationService.clearPagination(this.config.id);
  }

}
