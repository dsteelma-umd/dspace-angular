import { RemoteData } from 'src/app/core/data/remote-data';
import { NoContent } from 'src/app/core/shared/NoContent.model';
import { FeedbackDataService } from 'src/app/core/feedback/feedback-data.service';
import { Component, Inject, OnInit } from '@angular/core';
import { RouteService } from 'src/app/core/services/route.service';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { EPerson } from 'src/app/core/eperson/models/eperson.model';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { Router } from '@angular/router';
import { getHomePageRoute } from 'src/app/app-routing-paths';
import { take } from 'rxjs/operators';
import { NativeWindowRef, NativeWindowService } from 'src/app/core/services/window.service';
import { URLCombiner } from 'src/app/core/url-combiner/url-combiner';

@Component({
  selector: 'ds-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss']
})
/**
 * DRUM relies on a Wufoo form for generating feedback, so this component
 * has been stripped of its DSpace form building functionality, as it is
 * not used.
 *
 * The WufooFeedbackResolver is responsible for generating the form default
 * values, and redirecting to the Wufoo form URL.
 */
export class FeedbackFormComponent {
}
