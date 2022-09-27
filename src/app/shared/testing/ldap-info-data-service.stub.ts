import { Observable } from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { EPerson } from 'src/app/core/eperson/models/eperson.model';
import { LdapInfo } from 'src/app/core/eperson/models/ldap-info.model';
import { NoContent } from 'src/app/core/shared/NoContent.model';
import { createNoContentRemoteDataObject$ } from '../remote-data.utils';
import { FollowLinkConfig } from '../utils/follow-link-config.model';

/**
 * Stub for LdapInfoDataService
 */
export class LdapInfoDataServiceStub {
  /**
   * Always returns no content
   */
  public getLdapInfo(
      eperson: EPerson,
      useCachedVersionIfAvailable = true,
      reRequestOnStale = true, ...linksToFollow:
      FollowLinkConfig<LdapInfo>[]): Observable<RemoteData<LdapInfo | NoContent>> {
    return createNoContentRemoteDataObject$();
  }
}
