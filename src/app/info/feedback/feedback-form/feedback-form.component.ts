import { Component, OnInit } from '@angular/core';
import { catchError, filter, map, take, tap } from 'rxjs/operators';
import { RouteService } from 'src/app/core/services/route.service';
import { HALEndpointService } from 'src/app/core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from 'src/app/core/cache/builders/remote-data-build.service';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';
import { ConfigurationDataService } from 'src/app/core/data/configuration-data.service';
import { RemoteData } from 'src/app/core/data/remote-data';
import { ConfigurationProperty } from 'src/app/core/shared/configuration-property.model';

@Component({
  selector: 'ds-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
/**
 * Component displaying the contents of the Feedback Statement
 */
export class FeedbackFormComponent implements OnInit {

  constructor(
    private halService: HALEndpointService,
    protected rdb: RemoteDataBuildService,
    private httpClient: HttpClient,
    private routeService: RouteService,
    private configurationService: ConfigurationDataService
  ) {

  }

  public myScriptElement: HTMLScriptElement;
  public formHashFallback = '';

  /**
   * On init check if user is logged in and use its email if so
   */
  ngOnInit() {
    let linkName = 'wufoo-feedback';
    let formHashPropertyName = 'wufoo.feedback.formHash';
    let previousUrl$ = this.routeService.getPreviousUrl();

    const href$ = this.halService.getEndpoint(linkName).pipe(
      take(1),
    );

    this.configurationService.findByPropertyName(formHashPropertyName).pipe(
      filter((rd: RemoteData<ConfigurationProperty>) => rd.hasSucceeded),
      map((remoteData: RemoteData<ConfigurationProperty>) => { return remoteData.payload; } ),
      map((configProp: ConfigurationProperty) => { return configProp.values[0]; } ),
      catchError(err => {
        throw 'Error retrieving form hash';
      })
    ).subscribe(
      {
        next: (formHash) => { this.formHashFallback = formHash },
        error: (err) => { console.log('Error retrieving form hash'); }
      }
    );

    zip(previousUrl$, href$).subscribe(([previousPage, feedbackFormUrl]) => {
      this.httpClient.get(feedbackFormUrl, { params: { 'page': previousPage }, responseType: 'text' }).subscribe((data: any) => {
        let script = data;
        let myScriptElement = document.createElement('script');
        myScriptElement.type = 'text/javascript';
        myScriptElement.text = script;
        document.body.appendChild(myScriptElement);
      });
    });
  }
}
