import { DOCUMENT } from '@angular/common';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { cloneDeep } from 'lodash';
import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';
import { ItemMock } from 'src/app/shared/mocks/item.mock';
import { JsonLdService } from './json-ld.service';
import { emptyDataset, fullDataset } from './mocks/mock-json-ld-items';

describe('JsonLdService', () => {
  let jsonLdService: JsonLdService;
  let mockDocument: Document;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    //   providers: [
    //     { provide: Document, useValue: mockDocument },
    //   ]
    });
    mockDocument = TestBed.inject(DOCUMENT).implementation.createHTMLDocument();
    jsonLdService = new JsonLdService();
  }));

  describe('insertJsonLdSchema', () => {
    it('should insert a JSON-LD script into the HTML <head>', () => {
      jsonLdService.insertJsonLdSchema(mockDocument, 'test-json-ld', fullDataset.expectedJsonLd);
      expect(mockDocument.getElementById('test-json-ld').innerHTML).not.toBeNull();
      expect(mockDocument.getElementById('test-json-ld').innerHTML).toEqual(JSON.stringify(fullDataset.expectedJsonLd));
    });
  });

  describe('removeJsonLdSchema', () => {
    it('should remove a JSON-LD script with the given schema id from the HTML <head>', () => {
      jsonLdService.insertJsonLdSchema(mockDocument, 'test-full-dataset', fullDataset.expectedJsonLd);
      jsonLdService.insertJsonLdSchema(mockDocument, 'test-empty-dataset', emptyDataset.expectedJsonLd);

      expect(mockDocument.getElementById('test-full-dataset').innerHTML).not.toBeNull();
      expect(mockDocument.getElementById('test-empty-dataset').innerHTML).not.toBeNull();

      jsonLdService.removeJsonLdSchema(mockDocument, 'test-empty-dataset');

      expect(mockDocument.getElementById('test-empty-dataset')).toBeNull();
      expect(mockDocument.getElementById('test-full-dataset').innerHTML).toEqual(JSON.stringify(fullDataset.expectedJsonLd));
    });
  });

//   beforeEach(() => {
//     // mockDocument.location.href = 'http://example.org/';
//     item = cloneDeep(ItemMock);
//   });

//   describe('insertJsonLdSchema', () => {
//     it('should return an empty string for an item that is not a Dataset', () => {
//       let url = 'http://example.org/test/item';

//       let document = Object.assign(new Document(), mockDocument);
//       jsonLdService = new JsonLdService(document);
//       let scriptElement = document.getElementById('foobarbaz');
//       jsonLdService.insertJsonLdSchema(item);
//       expect(scriptElement).toBeNull();
//       // expect(jsonLdService.insertJsonLdSchema(item)).toEqual('');
//     });

//     it('should return a populated string for an item that is a Dataset', () => {
//       // mockDocument.location.href = emptyDataset.url ;
//       let document = Object.assign(new Document(), mockDocument);
//       jsonLdService = new JsonLdService(document);
//       let dataset = cloneDeep(emptyDataset);
//       dataset.url = document.location.href;
//       dataset.expectedJsonLd.url = document.location.href;
//       let expectedString = JSON.stringify(dataset.expectedJsonLd);
//       jsonLdService.insertJsonLdSchema(dataset.dspaceObject);
//       console.log('Foobar!');
//       let scriptElement = document.getElementById('foobarbaz');
//       expect(scriptElement.innerHTML).toEqual(expectedString);

// //      expect(jsonLdService.insertJsonLdSchema(emptyDataset.dspaceObject)).toEqual(expectedString);
//     });
//   });
});
