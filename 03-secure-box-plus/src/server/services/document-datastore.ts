import { Document } from '../models/document';
export { Document };

import { UserDataStore } from './user-datastore';
import { DocumentShareDataStore } from './document-share-datastore';

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

  private static getDoc( id: string ): Promise<Document> {
    return Promise.resolve<Document>( DocumentDataStore.documents.get( id ) );
  }

  static listDocuments( username: string ): Promise<Document[]> {
    let documents = [];

    DocumentDataStore.documents.forEach( ( v,k ) => {
      if ( v.owner == username )
        documents.push( v );
    } );

    return Promise.resolve<Document[]>( documents );
  }

  static getDocument( id: string, username: string ): Promise<Document> {

    return DocumentDataStore.getDoc( id )
      .then( (doc) => {
        return new Promise<Document>( (resolve,reject) => {
          let err;

          if ( !doc )
            err = 'Document ' + id + ' not found';
          else {
            // Must be owner to get document
            if ( doc.owner != username )
              err = 'Document ' + id + ' cannot be accessed';
          }

          if ( err )
            reject( err );
          else
            resolve( doc );

        });
    })
  }

  static updateDocument( id: string, username: string, attributes: {} ): Promise<Document> {

    return new Promise<Document>( (resolve, reject) => {
      // retrieve document (checks ownership)
      DocumentDataStore.getDocument( id, username )
        .then( doc => {
          // Copy new attributes to memory-base
          Object.assign( doc, attributes );

          resolve( doc );
        })
        .catch( err => {
          reject( err );
        } );
    })
  }

  /**
  *
  */
  static createDocument( attributes: Document, username: string ): Promise<Document> {

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

  /**
  *
  */
  static deleteDocument( id: string, username: string ): Promise<boolean> {

    return new Promise<boolean>( (resolve, reject) => {
      // retrieve document (checks ownership)
      DocumentDataStore.getDocument( id, username )
        .then( doc => {

          // delete it
          DocumentDataStore.documents.delete( doc.id );

          resolve( true );
        })
        .catch( err => {
          reject( err );
        } );
    })
  }

}

//DocumentDataStore.createDocument( { title: 'Test Document 01', contents: 'Test test test test test' }, 'sean' );
//DocumentDataStore.createDocument( { title: 'Test Document 02', contents: 'A very nice test document'}, 'sean' );
