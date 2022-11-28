import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { JsonLdService } from './json-ld.service';
import { DatasetJsonLdTransformer } from './json-ld-dataset.transfomer';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';

@Component({
  selector: 'ds-json-ld-dataset',
  styles: [],
  template: ''
})
export class JsonLdDatasetComponent implements OnInit, OnDestroy {
  transformer: DatasetJsonLdTransformer;

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
    this.transformer = new DatasetJsonLdTransformer();
  }

  ngOnInit(): void {
    if (this.transformer.handles(this.item)) {
      let url = this.document.location.href;
      let jsonLd = this.transformer.asJsonLd(url, this.item);
      this.jsonLdService.insertJsonLdSchema(this.document, this.schemaId, jsonLd);
    }
  }

  handles(dspaceObject: DSpaceObject) {
    return this.transformer.handles(dspaceObject);
  }

  ngOnDestroy(): void {
    this.jsonLdService.removeJsonLdSchema(this.document, this.schemaId);
  }
}


