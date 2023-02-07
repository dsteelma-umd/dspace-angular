import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { EmbargoListService } from 'src/app/embargo-list/embargo-list.service';

/**
 * This component represents the `Restricted Access` DSpace page.
 */
@Component({
  selector: 'ds-restricted-access',
  templateUrl: './restricted-access.component.html',
  styleUrls: ['./restricted-access.component.scss']
})
export class RestrictedAccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private embargoListService: EmbargoListService,
    private translateService: TranslateService,
    private datePipe: DatePipe
  ) {
  }

  /**
   * The bitstream UUID retrieveid from the URL
   */
  private bitstreamUuid: string;

  /**
   * The embargo message to display to the user.
   */
  embargoMessage: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.bitstreamUuid = params.id;
    });

    this.embargoListService.getEmbargo(this.bitstreamUuid).subscribe({
      next: (data: any) => {
        this.embargoMessage.next(this.setEmbargoMessage(data.payload));
      },
      error: () => {
        this.embargoMessage.next(this.setEmbargoMessage(null));
      }
    });
  }

  /**
   * Returns the embargo messsage to display to the user, including the date
   * the embargo will be lifted (if any).
   */
  setEmbargoMessage(embargo): string {
    let message;

    if (embargo != null ) {
      let parsedDate = null;
      let embargoEndDateString = embargo.endDateString;

      if (embargoEndDateString != null) {
        try {
          parsedDate = this.datePipe.transform(embargoEndDateString,  'longDate');
        } catch (error) {
          console.log(`Error parsing: '${embargoEndDateString}'`);
        }
      }
      if (parsedDate == null) {
        this.translateService.get('bitstream.embargo.restricted-access.embargo-not-available').subscribe((res: string) => {
          message = res;
        });
      } else {
         this.translateService.get('bitstream.embargo.restricted-access.embargo-until', {'embargoEndDate': parsedDate}).subscribe((res: string) => {
          message = res;
         });
      }
    } else {
      // This case shouldn't happen, but just in case we don't get an embargo
      // object, just show the "embargo-not-available" message
      this.translateService.get('bitstream.embargo.restricted-access.embargo-not-available').subscribe((res: string) => {
        message = res;
      });
    }
    return message;
  }
}
