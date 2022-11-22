import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonLdService {
  insertJsonLdSchema(document: Document, schemaId: string, jsonLd: any): void {
    let script = document.createElement('script');
    script.type = 'application/json+ld';
    script.text = JSON.stringify(jsonLd);
    script.id = schemaId;
    document.head.appendChild(script);
  }

  removeJsonLdSchema(document: Document, schemaId: string): void {
    let elementToRemove = document.getElementById(schemaId);
    if (elementToRemove) {
      document.head.removeChild(elementToRemove);
    }
  }
}
