import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { RequestService } from 'src/app/core/data/request.service';
import { RouteService } from 'src/app/core/services/route.service';
import { HALEndpointService } from 'src/app/core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from 'src/app/core/cache/builders/remote-data-build.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { merge, mergeMap, zip } from 'rxjs';

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
    private requestService: RequestService,
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
    // previousUrl$.subscribe((url) => { console.log(`----previous url: ${url}`) });

    const href$ = this.halService.getEndpoint(linkName).pipe(
      take(1),
    );

    zip(previousUrl$, href$).subscribe(([previousUrl, feedbackFormUrl]) => {
      console.log(`---previousUrl=${previousUrl}`);
      console.log(`---url=${feedbackFormUrl}`);
      // this.httpClient.get(results[1], { params: { 'page': 'https://example.com/abc' }, responseType: 'text' }).subscribe((data: any) => {
      //   console.log(`---data=${data}`);
      //   let script = data;
      //   let myScriptElement = document.createElement('script');
      //   myScriptElement.type = 'text/javascript';
      //   myScriptElement.text = script;
      //   document.body.appendChild(myScriptElement);
      // });
    });

  }
}
