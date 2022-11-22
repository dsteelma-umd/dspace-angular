import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class JsonLdService {
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
  }

  removeJsonLdSchema(schemaId: string): void {
    let elementToRemove = this.document.getElementById(schemaId);
    if (elementToRemove) {
      this.document.head.removeChild(elementToRemove);
    }
  }
}
