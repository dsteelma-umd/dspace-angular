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
import { take } from 'rxjs/operators';
import { NativeWindowRef, NativeWindowService } from '../../../core/services/window.service';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';

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

  public myScriptElement: HTMLScriptElement;

  /**
   * On init check if user is logged in and use its email if so
   */
  ngOnInit() {

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

    this.myScriptElement = document.createElement('script');
    // this.myScriptElement.src = 'src/assets/scripts/wufoo.js';
    // document.body.appendChild(this.myScriptElement);

    this.myScriptElement.text = `
      var wufooForm;
      (function(d, t) {
        var s = d.createElement(t),
            options = {
              'userName':'libumd', 'formHash':'r12gwaic1xvrtzs', 'autoResize':true, 'height':'797', 'async':true, 'host':'wufoo.com', 'header':'show', 'ssl':true,
              'defaultValues': 'field8=foobar%20baz'
            };
        s.src = ('https:' == d.location.protocol ?'https://':'http://') + 'secure.wufoo.com/scripts/embed/form.js';
        s.onload = s.onreadystatechange = function() {
          var rs = this.readyState;
          if (rs)
            if (rs != 'complete')
              if (rs != 'loaded') return;
          try {
            wufooForm = new WufooForm();
            wufooForm.initialize(options);
            wufooForm.display();
          } catch (e) { }
        }; var scr = d.getElementsByTagName(t)[0], par = scr.parentNode; par.insertBefore(s, scr); })(document, 'script');
      `;
       document.body.appendChild(this.myScriptElement);

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
