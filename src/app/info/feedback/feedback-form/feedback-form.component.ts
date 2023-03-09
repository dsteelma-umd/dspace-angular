import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { RequestService } from 'src/app/core/data/request.service';
import { HALEndpointService } from 'src/app/core/shared/hal-endpoint.service';
import { RemoteDataBuildService } from 'src/app/core/cache/builders/remote-data-build.service';
import { HttpClient } from '@angular/common/http';

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
    private httpClient: HttpClient
  ) {
  }

  public myScriptElement: HTMLScriptElement;

  /**
   * On init check if user is logged in and use its email if so
   */
  ngOnInit() {

    let linkName = 'wufoo-feedback';

    const href$ = this.halService.getEndpoint(linkName).pipe(
      take(1),
    );

    href$.subscribe((href) => {
      this.httpClient.get(href, { responseType: 'text' }).subscribe((data: any) => {
        console.log(`---data=${data}`);
        let script = data;
        let myScriptElement = document.createElement('script');
        myScriptElement.type = 'text/javascript';
        myScriptElement.text = script;
        document.body.appendChild(myScriptElement);
      });
    });

  }
}
