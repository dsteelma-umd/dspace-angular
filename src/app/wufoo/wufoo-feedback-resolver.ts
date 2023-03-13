// import { BreadcrumbConfig } from '../../breadcrumbs/breadcrumb/breadcrumb-config.model';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs';
import { getHomePageRoute } from '../app-routing-paths';
import { RouteService } from '../core/services/route.service';
import { NativeWindowRef, NativeWindowService } from '../core/services/window.service';
import { URLCombiner } from '../core/url-combiner/url-combiner';
// import { I18nBreadcrumbsService } from './i18n-breadcrumbs.service';
// import { hasNoValue } from '../../shared/empty.util';
// import { currentPathFromSnapshot } from '../../shared/utils/route.utils';

/**
 * The class that resolves a BreadcrumbConfig object with an i18n key string for a route
 */
@Injectable({
  providedIn: 'root'
})
export class WufooFeedbackResolver implements Resolve<any> {
  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    private routeService: RouteService,
    private router: Router,
    private httpClient: HttpClient
  ) {
  }

  /**
   * Method for resolving an I18n breadcrumb configuration object
   * @param {ActivatedRouteSnapshot} route The current ActivatedRouteSnapshot
   * @param {RouterStateSnapshot} state The current RouterStateSnapshot
   * @returns BreadcrumbConfig object
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    this.routeService.getCurrentUrl().pipe(take(1)).subscribe((url: string) => {
      if (!url) {
        url = '/';
      }
      const previousPage = new URLCombiner(this._window.nativeWindow.origin, url).toString();

      let feedbackFormUrl = 'http://localhost:8080/server/api/wufoo-feedback';
      this.httpClient.get(feedbackFormUrl, { params: { 'page': previousPage } }).subscribe((obj) => {
        let redirectUrl = obj['wufooFeedbackFormUrl'];
        console.log(`-----relatedUrl: ${redirectUrl}`);
        window.location.href = redirectUrl;
      });
    });

    // const key = route.data.breadcrumbKey;
    // if (hasNoValue(key)) {
    //   throw new Error('You provided an i18nBreadcrumbResolver for url \"' + route.url + '\" but no breadcrumbKey in the route\'s data');
    // }
    // const fullPath = currentPathFromSnapshot(route);
    // return { provider: this.breadcrumbService, key: key, url: fullPath };
  }
}
