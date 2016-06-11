import { Router } from 'express';
import { User, UserDataStore } from '../services/user-datastore';

export var apiRouter = Router( );

apiRouter
  .get( '/users/:username', (req, res) => {
    // get user from datastore
    new UserDataStore().getUserByUsername( req.params.username )
      .then( user => {
        res.json( { user: user } );
      });
  })
  .post( '/users/:username', (req, res) => {
    // update user in datastore
    // get user from datastore
    new UserDataStore().updateUser( req.params.username, req.body )
      .then( user => {
        res.json( { user: user } );
      });
  })
  .post( '/users/', (req, res) => {
    // create new user in datastore
    new UserDataStore().createUser( <User><any>req )
      .then( user => {
        res.json( { user: user } );
      });
  });
