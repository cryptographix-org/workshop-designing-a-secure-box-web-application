import { Router, Request, Response } from 'express';

import { DocumentShare, DocumentShareDataStore } from '../services/document-share-datastore';

import { authenticateUser } from './auth';

/**
* Create and export sub-router for '/api/shares'
*/
export var router = Router( );

/**
* RESTful API ('CRUD'-style)
*   GET    /api/shares/                 (auth) returns list of User's Shares (from/to)
*   PUT    /api/shares/                 (auth) creates new Share
*
*   GET    /api/shares/<share-id>       (auth) get Share (incl. document)
*   POST   /api/shares/<share-id>       (auth) update Share
*   DELETE /api/shares/<share-id>       (auth) delete Share
*/
router
  .get( '/', authenticateUser, (req, res) => {
    DocumentShareDataStore.listDocumentShares( req.user )
      .then( shares => {
        res.json( JSON.stringify( shares ) );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .put( '/', authenticateUser, (req, res) => {
    // create new document in datastore
    DocumentShareDataStore.createDocumentShare( <DocumentShare>req.body, req.user )
      .then( share => {
        res.json( share );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .get( '/:id', authenticateUser, (req: Request, res) => {
    DocumentShareDataStore.getDocumentShare( req.params.id, req.user )
      .then( share => {
        res.json( { share: share } );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .post( '/:id', authenticateUser, (req: Request, res) => {
    DocumentShareDataStore.updateDocumentShare( req.params.id, req.user, req.params )
      .then( share => {
        res.json( { share: share } );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  });
