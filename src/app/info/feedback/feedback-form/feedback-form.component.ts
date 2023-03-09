import { RemoteData } from '../../../core/data/remote-data';
import { NoContent } from '../../../core/shared/NoContent.model';
import { FeedbackDataService } from '../../../core/feedback/feedback-data.service';
import { Component, Inject, OnInit } from '@angular/core';
import { RouteService } from '../../../core/services/route.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { Router } from '@angular/router';
import { getHomePageRoute } from '../../../app-routing-paths';
import { delay, distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { RequestService } from 'src/app/core/data/request.service';
import { HALEndpointService } from 'src/app/core/shared/hal-endpoint.service';
import { isEmpty, isNotEmpty } from 'src/app/shared/empty.util';
import { GetRequest } from 'src/app/core/data/request.models';
import { RemoteDataBuildService } from 'src/app/core/cache/builders/remote-data-build.service';
import { Observable, of } from 'rxjs';
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

  // /**
  //  * Form builder created used from the feedback from
  //  */
  // feedbackForm = this.fb.group({
  //   email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
  //   message: ['', Validators.required],
  //   page: [''],
  // });

  // constructor(
  //   @Inject(NativeWindowService) protected _window: NativeWindowRef,
  //   public routeService: RouteService,
  //   private fb: FormBuilder,
  //   protected notificationsService: NotificationsService,
  //   protected translate: TranslateService,
  //   private feedbackDataService: FeedbackDataService,
  //   private authService: AuthService,
  //   private router: Router) {
  // }

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
    ).subscribe((href) => {

      this.httpClient.get(href, { responseType: 'text' }).subscribe((data: any) => {
        console.log(`---data=${data}`);
        let script = data;
        let myScriptElement = document.createElement('script');
        myScriptElement.type = 'text/javascript';
        myScriptElement.text = script;
        document.body.appendChild(myScriptElement);

        // const output = data.replaceAll(new RegExp('.*\\@(.*)', 'g'), '$1')
        //   .replaceAll('The script has started', '')
        //   .replaceAll('The script has completed', '');
        // this.notificationsService.info(this.translateService.get('collection.source.controls.test.completed'), output);
      });
    });

    // let result = this.rdb.buildFromHref(href$);
    // result.subscribe((obj) => {
    //   console.log('foobaz');
    //    console.log(`---obj=${obj}`);

    //   if (obj['payload'] && obj['payload']['wufooFormScript']) {
    //     let wufooFormScript = obj['payload']['wufooFormScript'];
    //     console.log(`wufooFormScript=${wufooFormScript}`);
    //   }
    // });

    // let foo = of(['http://localhost:8080/server/api/wufoo-feedback']);
    // foo.pipe(
    //   tap((value) => { console.log(`----${value}`); }),
    //   delay(1000)
    // ).subscribe((value) => {
    //   let url = value;
    //     let myScriptElement = document.createElement('script');
    //     myScriptElement.type = 'text/javascript';
    //     myScriptElement.text = `
    //     var wufooForm;
    //     (function(d, t) {
    //       var s = d.createElement(t),
    //           options = {
    //             'userName':'libumd', 'formHash':'r12gwaic1xvrtzs', 'autoResize':true, 'height':'797', 'async':true, 'host':'wufoo.com', 'header':'show', 'ssl':true,
    //             'defaultValues': 'field1=foobar%20baz'
    //           };
    //       s.src = ('https:' == d.location.protocol ?'https://':'http://') + 'secure.wufoo.com/scripts/embed/form.js';
    //       s.onload = s.onreadystatechange = function() {
    //         var rs = this.readyState;
    //         if (rs)
    //           if (rs != 'complete')
    //             if (rs != 'loaded') return;
    //         try {
    //           wufooForm = new WufooForm();
    //           wufooForm.initialize(options);
    //           wufooForm.display();
    //         } catch (e) { }
    //       }; var scr = d.getElementsByTagName(t)[0], par = scr.parentNode; par.insertBefore(s, scr); })(document, 'script');
    //     `;
    //     document.body.appendChild(myScriptElement);
    // });


    // this.authService.getAuthenticatedUserFromStore().pipe(take(1)).subscribe((user: EPerson) => {
    //   if (!!user) {
    //     this.feedbackForm.patchValue({ email: user.email });
    //   }
    // });

    // this.routeService.getPreviousUrl().pipe(take(1)).subscribe((url: string) => {
    //   if (!url) {
    //     url = getHomePageRoute();
    //   }
    //   const relatedUrl = new URLCombiner(this._window.nativeWindow.origin, url).toString();
    //   this.feedbackForm.patchValue({ page: relatedUrl });
    // });

    // const requestId = this.requestService.generateRequestId();

    // let linkName = 'wufoo-feedback';

    // const href$ = this.halService.getEndpoint(linkName).pipe(
    //   filter((href: string) => isNotEmpty(href)),
    // );

    // href$.pipe(take(1)).subscribe((url: string) => {
    //   //const request = new GetRequest(this.requestService.generateRequestId(), url);
    //   //this.requestService.send(request, true);
    //   let myScriptElement: HTMLScriptElement = document.createElement('script');
    //   myScriptElement.type = 'text/javascript';
    //   myScriptElement.src = url;
    //   document.body.appendChild(myScriptElement);
    // });

//     let result =  this.rdb.buildFromHref(href$);
//     result.subscribe((obj) => {
//       console.log(`---obj=${obj}`);

//       if (obj['payload'] && obj['payload']['wufooFormScript']) {
//         let wufooFormScript = obj['payload']['wufooFormScript'];
//         console.log(`wufooFormScript=${wufooFormScript}`);
//         let myScriptElement: HTMLScriptElement = document.createElement('script');
// //        myScriptElement.src = String.raw(wufooFormScript);
//         let foobar = `
//         var r12gwaic1xvrtzs;
//     (function(d, t) {
//         var s = d.createElement(t),
//         options = {
//             'userName':'libumd',
//             'formHash':'r12gwaic1xvrtzs',
//             'autoResize':true, 'height':'797',
//             'async':true,
//             'host':'wufoo.com',
//             'header':'show',
//             'ssl':true,
//             defaultValues: 'Field7=localhost:4000/&Field8=Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/110.0&Field10=null&Field11=FB8BC955EA746431313CB87EE7003BCB&Field13=Wed Mar 08 18:38:56 UTC 2023&Field15=localhost'
//         };
//         s.src = ('https:' == d.location.protocol ?'https://':'http://') + 'secure.wufoo.com/scripts/embed/form.js';
//         s.onload = s.onreadystatechange = function() {
//             var rs = this.readyState;
//             if (rs)
//                 if (rs != 'complete')
//                     if (rs != 'loaded')
//                         return;
//             try {
//                 r12gwaic1xvrtzs = new WufooForm();
//                 $formHash.initialize(options);
//                 $formHash.display();
//             } catch (e) { }
//         };
//         var scr = d.getElementsByTagName(t)[0], par = scr.parentNode; par.insertBefore(s, scr);
//     })(document, 'script');
//         `;
//         myScriptElement.type = 'application/javascript';
//         myScriptElement.text = foobar;

//         document.body.appendChild(myScriptElement);
//         r12gwaic1xvrtzs();
//       }
//     });
//     console.log(`---result = ${result}`);






    // this.myScriptElement = document.createElement('script');
    // this.mt
    // this.myScriptElement.src = 'src/assets/scripts/wufoo.js';
    // document.body.appendChild(this.myScriptElement);

    // this.myScriptElement.text = `
    //   var wufooForm;
    //   (function(d, t) {
    //     var s = d.createElement(t),
    //         options = {
    //           'userName':'libumd', 'formHash':'r12gwaic1xvrtzs', 'autoResize':true, 'height':'797', 'async':true, 'host':'wufoo.com', 'header':'show', 'ssl':true,
    //           'defaultValues': 'field8=foobar%20baz'
    //         };
    //     s.src = ('https:' == d.location.protocol ?'https://':'http://') + 'secure.wufoo.com/scripts/embed/form.js';
    //     s.onload = s.onreadystatechange = function() {
    //       var rs = this.readyState;
    //       if (rs)
    //         if (rs != 'complete')
    //           if (rs != 'loaded') return;
    //       try {
    //         wufooForm = new WufooForm();
    //         wufooForm.initialize(options);
    //         wufooForm.display();
    //       } catch (e) { }
    //     }; var scr = d.getElementsByTagName(t)[0], par = scr.parentNode; par.insertBefore(s, scr); })(document, 'script');
    //   `;
    //    document.body.appendChild(this.myScriptElement);

        // var scr = d.getElementsByTagName(t)[0], par = scr.parentNode;
        // par.insertBefore(s, scr); })(document, 'script');
    // )
  }

  // /**
  //  * Function to create the feedback from form values
  //  */
  // createFeedback(): void {
  //   const url = this.feedbackForm.value.page.replace(this._window.nativeWindow.origin, '');
  //   this.feedbackDataService.create(this.feedbackForm.value).pipe(getFirstCompletedRemoteData()).subscribe((response: RemoteData<NoContent>) => {
  //     if (response.isSuccess) {
  //       this.notificationsService.success(this.translate.instant('info.feedback.create.success'));
  //       this.feedbackForm.reset();
  //       this.router.navigateByUrl(url);
  //     }
  //   });
  // }

}
