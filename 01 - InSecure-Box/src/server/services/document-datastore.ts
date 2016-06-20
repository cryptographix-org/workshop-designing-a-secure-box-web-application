import { Document } from '../models/document';
export { Document };

import { UserDataStore } from './user-datastore';

//import { cuid } from 'cuid';
var cuid = require( 'cuid' );

/**
*
*/
export class DocumentDataStore {
  /**
  * Our memory-base of documents
  * Maps docname -> Document
  */
  static documents: Map<string, Document> = new Map<string, Document>();

  static listDocuments( username: string ): Promise<Document[]> {
    let documents = [];

    DocumentDataStore.documents.forEach( ( v,k ) => {
      if ( v.owner == username )
        documents.push( v );
    } );

    return Promise.resolve<Document[]>( documents );
  }

  static getDocument( id: string, username: string ): Promise<Document> {

    return new Promise<Document>( (resolve, reject) => {
      let doc = DocumentDataStore.documents.get( id );

      if ( !doc )
        reject( 'Document ' + id + ' not found' );
      else
        return Promise.resolve<Document>( doc )
        .then( doc => {
          if ( doc.owner != username )
            reject( 'Document ' + id + ' cannot be accessed' );
        } );
    })
  }

  static updateDocument( id: string, username: string, attributes: {} ): Promise<Document> {
    return new Promise<Document>( (resolve, reject) => {
      DocumentDataStore.getDocument( id, username )
        .then( doc => {
          // Copy new attributes to memory-base
          Object.assign( doc, attributes );

          resolve( doc );
        });
    })
  }

  /**
  *
  */
  static createDocument( attributes: { id?: string }, username: string ): Promise<Document> {

    if ( DocumentDataStore.documents.get( attributes.id ) )
      return Promise.reject<Document>( 'Document already exists' );

    // for now, just fabricate a doc ...
    let doc: Document = Object.assign( {},
      attributes,
      {
        id: cuid(),
        owner: username,
      } );

    // save it
    DocumentDataStore.documents.set( doc.id, doc );

    return Promise.resolve<Document>( doc );
  }
}
