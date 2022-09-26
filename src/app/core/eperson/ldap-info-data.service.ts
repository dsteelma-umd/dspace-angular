import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createSelector, select, Store } from '@ngrx/store';
import { Operation } from 'fast-json-patch';
import { Observable } from 'rxjs';
import { find, map, take } from 'rxjs/operators';
import {
  EPeopleRegistryCancelEPersonAction,
  EPeopleRegistryEditEPersonAction
} from '../../access-control/epeople-registry/epeople-registry.actions';
import { EPeopleRegistryState } from '../../access-control/epeople-registry/epeople-registry.reducers';
import { AppState } from '../../app.reducer';
import { hasValue, hasNoValue } from '../../shared/empty.util';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { FollowLinkConfig } from '../../shared/utils/follow-link-config.model';
import { dataService } from '../cache/builders/build-decorators';
import { RemoteDataBuildService } from '../cache/builders/remote-data-build.service';
import { RequestParam } from '../cache/models/request-param.model';
import { ObjectCacheService } from '../cache/object-cache.service';
import { DataService } from '../data/data.service';
import { DSOChangeAnalyzer } from '../data/dso-change-analyzer.service';
import { PaginatedList, buildPaginatedList } from '../data/paginated-list.model';
import { RemoteData } from '../data/remote-data';
import { PatchRequest, PostRequest, } from '../data/request.models';
import { RequestService } from '../data/request.service';
import { HALEndpointService } from '../shared/hal-endpoint.service';
import { getRemoteDataPayload, getFirstSucceededRemoteData, } from '../shared/operators';
import { LdapInfo } from './models/ldap-info.model';
import { LDAP_INFO } from './models/ldap-info.resource-type';
import { NoContent } from '../shared/NoContent.model';
import { PageInfo } from '../shared/page-info.model';
import { FindListOptions } from '../data/find-list-options.model';
import { EPerson } from './models/eperson.model';

const ePeopleRegistryStateSelector = (state: AppState) => state.epeopleRegistry;
const editEPersonSelector = createSelector(ePeopleRegistryStateSelector, (ePeopleRegistryState: EPeopleRegistryState) => ePeopleRegistryState.editEPerson);

/**
 * A service to retrieve {@link LdapInfos}s from the REST API
 */
@Injectable()
@dataService(LDAP_INFO)
export class LdapInfoDataService extends DataService<LdapInfo> {

  protected linkPath = 'ldap-info';

  constructor(
    protected requestService: RequestService,
    protected rdbService: RemoteDataBuildService,
    protected store: Store<any>,
    protected objectCache: ObjectCacheService,
    protected halService: HALEndpointService,
    protected notificationsService: NotificationsService,
    protected http: HttpClient,
    protected comparator: DSOChangeAnalyzer<LdapInfo>
  ) {
    super();
  }

  public getLdapInfo(eperson: EPerson, useCachedVersionIfAvailable = true, reRequestOnStale = true, ...linksToFollow: FollowLinkConfig<LdapInfo>[]): Observable<RemoteData<LdapInfo | NoContent>> {
    // const findListOptions = new FindListOptions();
    // findListOptions.searchParams = [new RequestParam('email', encodeURIComponent(query))];
    // const href$ = this.getSearchByHref(this.searchByEmailPath, findListOptions, ...linksToFollow);

    return this.findByHref(eperson._links['ldap-info'].href, useCachedVersionIfAvailable, reRequestOnStale, ...linksToFollow);
  }
}
