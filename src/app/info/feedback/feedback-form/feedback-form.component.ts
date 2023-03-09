import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { RouteService } from 'src/app/core/services/route.service';
import { HALEndpointService } from 'src/app/core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from 'src/app/core/cache/builders/remote-data-build.service';
import { HttpClient } from '@angular/common/http';
import { zip } from 'rxjs';

declare function r12gwaic1xvrtzs(): any;
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
    private routeService: RouteService
  ) {

  }

  public myScriptElement: HTMLScriptElement;

  /**
   * On init check if user is logged in and use its email if so
   */
  ngOnInit() {
    let linkName = 'wufoo-feedback';
    let previousUrl$ = this.routeService.getPreviousUrl();

    const href$ = this.halService.getEndpoint(linkName).pipe(
      take(1),
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
