import { cloneDeep } from 'lodash';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { Item } from 'src/app/core/shared/item.model';
import { MetadataValue } from 'src/app/core/shared/metadata.models';
import { ItemMock } from 'src/app/shared/mocks/item.mock';
import { DatasetJsonLdTransformer } from './json-ld-transfomer';
import { emptyDataset, fullDataset } from './mocks/mock-json-ld-items';

describe('DatasetJsonLdTransformer', () => {
  let item: DSpaceObject;
  let transformer: DatasetJsonLdTransformer;

  let itemUrl = 'http://example.org/handle/10673/6';

  // Modified the given item with the changes in the given Map
  let createModifiedItem = (itemToModify, metadataChanges) => {
    let modifiedItem = cloneDeep(itemToModify);
    for (const [key, value] of metadataChanges.entries()) {
      modifiedItem.metadata[key] = value;
    }
    return modifiedItem;
  };

  // Modifies the ItemMock to have a "dc.type" of "Dataset"
  const datasetItem: Item = createModifiedItem(ItemMock,
    new Map([
      ['dc.type', [{'language': 'en_US', 'value': 'Dataset'}]],
      ['dc.contributor.author', [{'language': 'en_US', 'value': 'Author, Test'}]],
      ['dc.rights.uri', [{'language': '*', 'value': 'http://creativecommons.org/licenses/by-nc-nd/3.0/us/'}]],
    ])
  );

  beforeEach(() => {
    item = cloneDeep(ItemMock);
    transformer = new DatasetJsonLdTransformer();
  });

  describe('handles', () => {
    it('returns true if the "dc.type" metadata field of the item is "Dataset"', () => {
      item.metadata['dc.type'] = [{ value: 'Dataset' }] as MetadataValue[];
      expect(transformer.handles(item)).toBe(true);
    });

    describe('returns false', () => {
      it('if the "dc.type" metadata field of the item is not "Dataset"', () => {
        expect(item.hasMetadata('dc.type')).toBe(true);
        expect(transformer.handles(item)).toBe(false);
      });

      it('if the "dc.type" metadata field of the item is not present', () => {
        item.removeMetadata('dc.type');
        expect(transformer.handles(item)).toBe(false);
      });
    });
  });

  describe('asJson', ()=> {
    it('fullDataset - returns the JSON-LD object for the given DSpaceObject', () => {
      let url = fullDataset.url;
      let jsonLd = transformer.asJsonLd(url, fullDataset.dspaceObject);
      expect(jsonLd).toEqual(fullDataset.expectedJsonLd);
    });
    it('emptyDataset - returns a JSON-LD object with default values when values are not given', () => {
      let url = emptyDataset.url;
      let jsonLd = transformer.asJsonLd(url, emptyDataset.dspaceObject);
      expect(jsonLd).toEqual(emptyDataset.expectedJsonLd);
    });
  });
});
