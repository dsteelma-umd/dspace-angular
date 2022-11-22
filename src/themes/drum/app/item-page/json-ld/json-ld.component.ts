import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { NativeWindowRef, NativeWindowService } from 'src/app/core/services/window.service';
import { Item } from 'src/app/core/shared/item.model';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
import { ItemPageComponent as BaseComponent } from '../../../../../app/item-page/simple/item-page.component';
import { fadeInOut } from '../../../../../app/shared/animations/fade';
import { JsonLdService } from '../json-ld/json-ld.service';

@Component({
  selector: 'ds-json-ld',
  styleUrls: ['json-ld.component.scss'],
  templateUrl: 'json-ld.component.html',
})
export class JsonLdComponent implements OnInit, OnDestroy {
  /**
   * The Item to display the JSON-LD for
   */
  @Input() item: Item;
  constructor(
    public jsonLdService: JsonLdService,
    public sanitizer: DomSanitizer,
  ) {
    console.log('---constructor');
  }

  ngOnInit(): void {
    this.jsonLdService.insertJsonLdSchema(this.item);
  }

  ngOnDestroy(): void {
    this.jsonLdService.removeJsonLdSchema(this.item);
  }
}
