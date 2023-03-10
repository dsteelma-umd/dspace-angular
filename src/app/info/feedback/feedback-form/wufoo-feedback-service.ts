import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, take, tap, zip } from 'rxjs';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';

@Injectable({
    providedIn: 'root'
})
export class WufooFeedbackService {
  constructor(
    protected httpClient: HttpClient,
    protected configurationService: ConfigurationDataService) {
  }

  /**
   * Returns an Observable from the embargo list REST endpoint.
   * @returns embargo list data
   */
  getWufooFeedbackScript(previousUrl$: Observable<string>, href$: Observable<string>): Observable<any> {
    return zip(previousUrl$, href$).pipe(
      map(([previousPage, feedbackFormUrl]) => {
        return this.httpClient.get(feedbackFormUrl, { params: { 'page': previousPage } });
      })
    );

    //  return this.halService.getEndpoint('/embargo-list').pipe(
    //    switchMap((endpoint: string) => this.restService.get(endpoint)));
  }
}
