import { DocumentShare } from '../models/document-share';
export { DocumentShare };

import { UserDataStore } from './user-datastore';
import { Document, DocumentDataStore } from './document-datastore';

//import { cuid } from 'cuid';
var cuid = require( 'cuid' );

/**
*
*/
export class DocumentShareDataStore {
  /**
  * Our memory-base of document-shares
  * Maps share-id -> DocumentShare
  */
  static shares: Map<string, DocumentShare> = new Map<string, DocumentShare>();

  static listDocumentShares( username: string ): Promise<DocumentShare[]> {
    let shares = [];

    DocumentShareDataStore.shares.forEach( ( v,k ) => {
      if ( v.from == username )
        shares.push( v );

      if ( v.to == username )
        shares.push( v );
    } );

    return Promise.resolve<DocumentShare[]>( shares );
  }

  static getShareForDocumentAndUser( id: string, username: string ): Promise<DocumentShare> {
    DocumentShareDataStore.shares.forEach( ( v,k ) => {
      if ( ( v.to == username ) && ( v.document == id ) )
        return Promise.resolve<DocumentShare>( v );
    } );

    return Promise.reject<DocumentShare>( "Cannot access document" );
  }

  static getDocumentShare( id: string, username: string ): Promise<DocumentShare> {

    return new Promise<DocumentShare>( (resolve, reject) => {
      let doc = DocumentShareDataStore.shares.get( id );

      if ( !doc )
        reject( 'Share ' + id + ' not found' );
      else
        return Promise.resolve<DocumentShare>( doc )
          .then( doc => {
            // Must be owner to get document
            if ( doc.to != username )
              reject( 'DocumentShare ' + id + ' cannot be accessed' );
          } );
    })
  }

  static updateDocumentShare( id: string, username: string, attributes: {} ): Promise<DocumentShare> {

    return new Promise<DocumentShare>( (resolve, reject) => {
      // retrieve document (checks ownership)
      DocumentShareDataStore.getDocumentShare( id, username )
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
  static createDocumentShare( attributes: { id?: string }, username: string ): Promise<DocumentShare> {

    if ( DocumentShareDataStore.shares.get( attributes.id ) )
      return Promise.reject<DocumentShare>( 'DocumentShare already exists' );

    // for now, just fabricate a doc ...
    let doc: DocumentShare = Object.assign( {},
      attributes,
      {
        id: cuid(),
        from: username,
      } );

    // save it
    DocumentShareDataStore.shares.set( doc.id, doc );

    return Promise.resolve<DocumentShare>( doc );
  }

  /**
  *
  */
  static deleteDocumentShare( id: string, username: string ): Promise<boolean> {

    return new Promise<boolean>( (resolve, reject) => {
      // retrieve document (checks ownership)
      DocumentShareDataStore.getDocumentShare( id, username )
        .then( doc => {

          // delete it
          DocumentShareDataStore.shares.delete( doc.id );

          resolve( true );
        })
        .catch( err => {
          reject( err );
        } );
    })
  }

}
