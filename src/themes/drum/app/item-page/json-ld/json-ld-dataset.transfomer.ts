import { DSpaceObject } from 'src/app/core/shared/dspace-object.model';

export class DatasetJsonLdTransformer {
  handles(item: DSpaceObject): boolean {
    return item.hasMetadata('dc.type', { value: 'Dataset' } );
  }

  private fromDspaceObject(url: string, dspaceObject: DSpaceObject): any {
    return {
      'type': dspaceObject.firstMetadataValue('dc.type') || '',
      'name': dspaceObject.firstMetadataValue('dc.title') || '',
      'url': url,
      'temporalCoverage': dspaceObject.firstMetadataValue('dc.date.issued')  || '',
      'descriptions': dspaceObject.allMetadataValues('dc.description.abstract'),
      'creators': dspaceObject.allMetadataValues('dc.contributor.author'),
      'identifiers': dspaceObject.allMetadataValues(['dc.identifier.uri', 'dc.identifier.*', 'dc.identifier']),
      'license': dspaceObject.firstMetadataValue('dc.rights.uri')  || ''
    };
  }

  asJsonLd(url: string, dspaceObject: DSpaceObject): any {
    let jsonObj = this.fromDspaceObject(url, dspaceObject);
    let description = jsonObj.descriptions.join(' ');
    let creator = [];

    for (const creatorName of jsonObj.creators) {
      let c = {
        '@type': 'Person',
        'name': creatorName
      };
      creator.push(c);
    }

    return {
      '@context' : 'http://schema.org',
      '@type': jsonObj.type,
      'name': jsonObj.name,
      'description': description,
      'url': jsonObj.url,
      'temporalCoverage': jsonObj.temporalCoverage,
      'creator': creator,
      'identifier': jsonObj.identifiers,
      'license': jsonObj.license
    };
  }
}
