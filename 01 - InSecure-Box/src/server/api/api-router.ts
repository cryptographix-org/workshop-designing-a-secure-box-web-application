import { Router, Request, Response, RequestHandler } from 'express';
import { User, UserDataStore } from '../services/user-datastore';
import { Document, DocumentDataStore } from '../services/document-datastore';

export var apiRouter = Router( );

function catcher( res: Response, prom: Promise<any> ): Promise<any> {
  return prom.catch( (err) => { res.status( 403 ).send( err ); } );
}

apiRouter
  .get( '/users/:username', (req, res) => {
    // get user from datastore
    UserDataStore.getUserByUsername( req.params.username )
      .then( user => {
        res.json( user );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .post( '/users/:username', (req, res) => {
    // update user in datastore
    // get user from datastore
    UserDataStore.updateUser( req.params.username, req.body )
      .then( user => {
        res.json( user );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .get( '/users/', (req, res) => {
    UserDataStore.listUsers()
      .then( users => {
        res.json( JSON.stringify( users ) );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .put( '/users/', (req, res) => {
    console.log( 'put ' + JSON.stringify( req.body ) );
    // create new user in datastore
    UserDataStore.createUser( <User>req.body )
      .then( user => {
        res.json( user );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .post( '/check/', authenticateUser, (req, res) => {
    // OK
    res.json( { success: true } );
  });

function authenticateUser( req, res, next ) {
  // get document from datastore
  UserDataStore.checkPassword( req.body.username, req.body.password )
    .then( ok => {
      if ( ok ) {
        req.user = req.body.username;

        delete req.body.password;
        delete req.body.username;

        next();
      }
      else
        res.sendStatus( 405 );
    })
    .catch( (err) => { res.status( 403 ).send( err ); } );
}

apiRouter
  .get( '/documents/:id', authenticateUser, (req: Request, res) => {
    DocumentDataStore.getDocument( req.params.id, req.user )
      .then( doc => {
        res.json( { doc: doc } );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .post( '/documents/:id', authenticateUser, (req: Request, res) => {
    DocumentDataStore.updateDocument( req.params.id, req.user, req.params )
      .then( doc => {
        res.json( { doc: doc } );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .get( '/documents/', authenticateUser, (req, res) => {
    DocumentDataStore.listDocuments( req.user )
      .then( docs => {
        res.json( JSON.stringify( docs ) );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .put( '/documents/', authenticateUser, (req, res) => {
    console.log( 'put ' + JSON.stringify( req.body ) );
    // create new user in datastore
    DocumentDataStore.createDocument( <Document>req.body, req.user )
      .then( doc => {
        res.json( doc );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
