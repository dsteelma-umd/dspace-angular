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

  insertJsonLdSchema(dspaceObject: DSpaceObject): void {
    let url = this.document.location.href;
    for (const t of this.jsonLdTransformers) {
        if (t.handles(dspaceObject)) {
          let script = this.document.createElement('script');
          script.type = 'application/json+ld';
          let json = t.asJsonLd(url, dspaceObject);
          script.text = JSON.stringify(json);
          script.id = 'foobarbaz';
          this.document.head.appendChild(script);
          console.log('---appended script');
        // return `<script type="application/ld+json">\n${JSON.stringify(json)}\n</script>`;
        //return JSON.stringify(json);
      }
    }
    // return '';
  }
  removeJsonLdSchema(dspaceObject: DSpaceObject): void {
    let elementToRemove = this.document.getElementById('foobarbaz');
    this.document.head.removeChild(elementToRemove);
    console.log('---removed element');
  }
}
