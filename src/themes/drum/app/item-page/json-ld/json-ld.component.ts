import { DOCUMENT } from '@angular/common';
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
import { DatasetJsonLdTransformer } from './json-ld-transfomer';

@Component({
  selector: 'ds-json-ld',
  styleUrls: ['json-ld.component.scss'],
  templateUrl: 'json-ld.component.html',
})
export class JsonLdComponent implements OnInit, OnDestroy {

  /**
   * The id to assign to the HTML script tag containing the JSON-LD schema
   */
  @Input() schemaId: string;
  /**
   * The Item to display the JSON-LD for
   */
  @Input() item: Item;
  constructor(
    public jsonLdService: JsonLdService,
    public sanitizer: DomSanitizer,
    @Inject(DOCUMENT) protected document: any
  ) {
    console.log('---constructor');
  }

  ngOnInit(): void {
    let transformer = new DatasetJsonLdTransformer();
    if (transformer.handles(this.item)) {
      let url = this.document.location.href;
      let jsonLd = transformer.asJsonLd(url, this.item);
      this.jsonLdService.insertJsonLdSchema(this.schemaId, jsonLd);
    }
  }

  ngOnDestroy(): void {
    this.jsonLdService.removeJsonLdSchema(this.schemaId);
  }
}
