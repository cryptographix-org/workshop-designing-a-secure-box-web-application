import { Router, Response } from 'express';
import { User, UserDataStore } from '../services/user-datastore';

export var apiRouter = Router( );

function catcher( res: Response, prom: Promise<any> ): Promise<any> {
  return prom.catch( (err) => { res.status( 403 ).send( err ); } );
}

apiRouter
  .get( '/users/:username', (req, res) => {
    // get user from datastore
    new UserDataStore().getUserByUsername( req.params.username )
      .then( user => {
        res.json( { user: user } );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .post( '/users/:username', (req, res) => {
    // update user in datastore
    // get user from datastore
    new UserDataStore().updateUser( req.params.username, req.body )
      .then( user => {
        res.json( user );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .get( '/users/', (req, res) => {
    new UserDataStore().listUsers()
      .then( users => {
        res.json( JSON.stringify( users ) );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .put( '/users/', (req, res) => {
    console.log( 'put ' + JSON.stringify( req.body ) );
    // create new user in datastore
    new UserDataStore().createUser( <User>req.body )
      .then( user => {
        res.json( user );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .post( '/check/:username', (req, res) => {
    // update user in datastore
    // get user from datastore
    new UserDataStore().checkPassword( req.params.username, req.body.password )
      .then( ok => {
        res.json( { success: ok } );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
;
