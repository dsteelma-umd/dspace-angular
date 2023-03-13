import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { take } from 'rxjs';
import { RouteService } from '../core/services/route.service';
import { NativeWindowRef, NativeWindowService } from '../core/services/window.service';
import { HALEndpointService } from '../core/shared/hal-endpoint.service';
import { URLCombiner } from '../core/url-combiner/url-combiner';
import { WufooFeedbackResponse } from './wufoo-feedback-response.model';

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
    private httpClient: HttpClient,
    private halService: HALEndpointService
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
      const referringPage = new URLCombiner(this._window.nativeWindow.origin, url).toString();

      let wufooFeedbackEndpoint = this.halService.getEndpoint('wufoo-feedback').subscribe((wufooFeedbackUrl) => {
        this.httpClient.get(wufooFeedbackUrl, { params: { 'page': referringPage } }).subscribe((obj) => {
          let wufooFeedbackResponse = <WufooFeedbackResponse> obj;
          let redirectUrl = wufooFeedbackResponse.wufooFeedbackFormUrl;
          window.location.href = redirectUrl;
        });
      });
    });
  }
}
