import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { BehaviorSubject, windowWhen } from 'rxjs';

/**
 * This component representing the `Restricted Access` DSpace page.
 */
@Component({
  selector: 'ds-restricted-access',
  templateUrl: './restricted-access.component.html',
  styleUrls: ['./restricted-access.component.scss']
})



export class RestrictedAccessComponent implements OnInit {
/**
 * The embargo message to display to the user.
 */
restrictedAccessMessage: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private translateService: TranslateService,
    private datePipe: DatePipe
  ) {
  }
  ngOnInit(): void {
    // Retrieve "restrictedAccess" parameter from history state,
    // see https://medium.com/javascript-everyday/keep-data-in-the-state-object-during-navigation-in-angular-5657af156fb8

    const { restrictedAccess } = window.history.state;

    let message;

    if ((restrictedAccess == null) || ('FOREVER' === restrictedAccess)) {
      message = this.getMessage('bitstream.restricted-access.message.forever', {});
    } else {
      message = 'bitstream.restricted-access.message.restricted-until';
      let parsedDate = this.datePipe.transform(restrictedAccess, 'longDate');
      message = this.getMessage('bitstream.restricted-access.message.restricted-until', { 'restrictedAccessDate': parsedDate});
    }

    this.restrictedAccessMessage.next(message);
  }

  protected getMessage(i18nKey: string, params: any): string {
    let translatedMessage = '';
    this.translateService.get(i18nKey, params).subscribe((result) => {
      translatedMessage = result;
    });
    return translatedMessage;
  }
}
