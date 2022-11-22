import { DOCUMENT } from '@angular/common';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { cloneDeep } from 'lodash';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { ItemMock } from 'src/app/shared/mocks/item.mock';
import { JsonLdService } from './json-ld.service';
import { emptyDataset } from './mocks/mock-json-ld-items';

describe('JsonLdService', () => {
  let jsonLdService: JsonLdService;
  let item: DSpaceObject;
  let mockDocument: Document;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    //   providers: [
    //     { provide: Document, useValue: mockDocument },
    //   ]
    });
    mockDocument = TestBed.inject(DOCUMENT);
  }));

  beforeEach(() => {
    // mockDocument.location.href = 'http://example.org/';
    item = cloneDeep(ItemMock);
  });

  describe('insertJsonLdSchema', () => {
    it('should return an empty string for an item that is not a Dataset', () => {
      let url = 'http://example.org/test/item';

      let document = Object.assign(new Document(), mockDocument);
      jsonLdService = new JsonLdService(document);
      let scriptElement = document.getElementById('foobarbaz');
      jsonLdService.insertJsonLdSchema(item);
      expect(scriptElement).toBeNull();
      // expect(jsonLdService.insertJsonLdSchema(item)).toEqual('');
    });

    it('should return a populated string for an item that is a Dataset', () => {
      // mockDocument.location.href = emptyDataset.url ;
      let document = Object.assign(new Document(), mockDocument);
      jsonLdService = new JsonLdService(document);
      let dataset = cloneDeep(emptyDataset);
      dataset.url = document.location.href;
      dataset.expectedJsonLd.url = document.location.href;
      let expectedString = JSON.stringify(dataset.expectedJsonLd);
      jsonLdService.insertJsonLdSchema(dataset.dspaceObject);
      console.log('Foobar!');
      let scriptElement = document.getElementById('foobarbaz');
      expect(scriptElement.innerHTML).toEqual(expectedString);

//      expect(jsonLdService.insertJsonLdSchema(emptyDataset.dspaceObject)).toEqual(expectedString);
    });
  });
});
