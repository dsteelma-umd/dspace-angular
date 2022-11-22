import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { AppConfig, APP_CONFIG } from 'src/config/app-config.interface';
import { DatasetJsonLdTransformer, JsonLdTransformer } from './json-ld-transfomer';

@Injectable({
  providedIn: 'root'
})

export class JsonLdService {
  protected jsonLdTransformers: JsonLdTransformer[] = [
    new DatasetJsonLdTransformer()
  ];

  constructor(
    @Inject(DOCUMENT) protected document: any
  ) {
  }

  insertJsonLdSchema(schemaId: string, jsonLd: any): void {
    let script = this.document.createElement('script');
    script.type = 'application/json+ld';
    script.text = JSON.stringify(jsonLd);
    script.id = schemaId;
    this.document.head.appendChild(script);
    console.log('---appended JSON-LD script: ' + schemaId);
  }

  removeJsonLdSchema(schemaId: string): void {
    let elementToRemove = this.document.getElementById(schemaId);
    if (elementToRemove) {
      this.document.head.removeChild(elementToRemove);
      console.log('---removed element: ' + schemaId);
    }
  }
}
