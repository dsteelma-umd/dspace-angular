import { cloneDeep } from 'lodash';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { MetadataValue } from 'src/app/core/shared/metadata.models';
import { ItemMock } from 'src/app/shared/mocks/item.mock';
import { JsonLdService } from './json-ld.service';
import { emptyDataset } from './mocks/mock-json-ld-items';

describe('JsonLdService', () => {
  let jsonLdService: JsonLdService;
  let item: DSpaceObject;

  beforeEach(() => {
    jsonLdService = new JsonLdService();
    item = cloneDeep(ItemMock);
  });

  describe('isDataset', () => {
    it('returns true if the "dc.type" metadata field of the item is "Dataset"', () => {
      item.metadata['dc.type'] = [{ value: 'Dataset' }] as MetadataValue[];
      expect(jsonLdService.isDataset(item)).toBe(true);
    });

    describe('returns false', () => {
      it('if the "dc.type" metadata field of the item is not "Dataset"', () => {
        expect(item.hasMetadata('dc.type')).toBe(true);
        expect(jsonLdService.isDataset(item)).toBe(false);
      });

      it('if the "dc.type" metadata field of the item is not present', () => {
        item.removeMetadata('dc.type');
        expect(jsonLdService.isDataset(item)).toBe(false);
      });
    });
  });

  describe('insertJsonLdSchema', () => {
    it('should return an empty string for an item that is not a Dataset', () => {
      let url = 'http://example.org/test/item';

      expect(jsonLdService.insertJsonLdSchema(url, item)).toEqual('');
    });

    it('should return a populated string for an item that is a Dataset', () => {
      let url = 'https://example.org/items/emptyDataset';
      let expectedString = `<script type="application/ld+json">\n${JSON.stringify(emptyDataset.expectedJsonLd)}\n</script>`;

      expect(jsonLdService.insertJsonLdSchema(url, emptyDataset.dspaceObject)).toEqual(expectedString);
    });
  });
});
