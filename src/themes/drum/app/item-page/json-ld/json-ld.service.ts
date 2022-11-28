import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonLdService {
  insertJsonLdSchema(document: Document, scriptId: string, jsonLd: any): void {
    let script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    script.id = scriptId;
    document.head.appendChild(script);
  }

  removeJsonLdSchema(document: Document, scriptId: string): void {
    let elementToRemove = document.getElementById(scriptId);
    if (elementToRemove) {
      document.head.removeChild(elementToRemove);
    }
  }
}
