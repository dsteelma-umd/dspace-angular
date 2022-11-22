import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { JsonLdService } from './json-ld.service';
import { DatasetJsonLdTransformer } from './json-ld-dataset.transfomer';

@Component({
  selector: 'ds-json-ld-dataset',
  styles: [],
  template: ''
})
export class JsonLdDatasetComponent implements OnInit, OnDestroy {
  /**
   * The id to assign to the HTML script tag containing the JSON-LD schema
   */
  @Input() schemaId: string;
  /**
   * The Item to display the JSON-LD for
   */
  @Input() item: Item;
  constructor(
    protected jsonLdService: JsonLdService,
    @Inject(DOCUMENT) protected document: any,
  ) {
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


