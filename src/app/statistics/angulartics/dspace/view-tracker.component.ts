import { Component, Input, OnInit } from '@angular/core';
import { Angulartics2 } from 'angulartics2';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSONameService } from 'src/app/core/breadcrumbs/dso-name.service';

/**
 * This component triggers a page view statistic
 */
@Component({
  selector: 'ds-view-tracker',
  styleUrls: ['./view-tracker.component.scss'],
  templateUrl: './view-tracker.component.html',
})
export class ViewTrackerComponent implements OnInit {
  @Input() object: DSpaceObject;

  constructor(
    public angulartics2: Angulartics2,
    private dsoNameService: DSONameService
  ) {
  }

  ngOnInit(): void {
    this.angulartics2.eventTrack.next({
      action: 'pageView',
      // UMD Customization
      // Matomo analytics requires a "category" property, unlike
      // Google Analytics which sets the category to "Event" by default
      properties: {object: this.object, category: 'Event',
        name: this.dsoNameService.getName(this.object) + '|' + window.location.href },
      // End UMD Customization
    });
  }
}
