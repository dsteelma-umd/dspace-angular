import { Injectable } from '@angular/core';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { DatasetJsonLdTransformer, JsonLdTransformer } from './json-ld-transfomer';

@Injectable({
  providedIn: 'root'
})

export class JsonLdService {
  protected jsonLdTransformers: JsonLdTransformer[] = [
    new DatasetJsonLdTransformer()
  ];

  /**
   * Returns true if the given DSpaceObject has a "dc.type" of "Dataset",
   * false otherwise.
   *
   * @param item the DSpaceObject to check
   * @return true if the given DSpaceObject has a "dc.type" of "Dataset",
   * false otherwise.
   */
  isDataset(item: DSpaceObject): boolean {
    // let dcType: string = item.firstMetadataValue('dc.type');

    // return dcType === 'Dataset';

    return item.hasMetadata('dc.type', { value: 'Dataset' } );
  }

  insertJsonLdSchema(url: string, dspaceObject: DSpaceObject): string {
    for (const t of this.jsonLdTransformers) {
      if (t.handles(dspaceObject)) {
        let json = t.asJsonLd(url, dspaceObject);
        return `<script type="application/ld+json">\n${JSON.stringify(json)}\n</script>`;
      }
    }
    return '';
  }
}
