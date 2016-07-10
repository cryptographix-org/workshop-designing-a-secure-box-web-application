import { Router, Request, Response, RequestHandler } from 'express';

import { User, UserDataStore } from '../services/user-datastore';

import { authenticateUser, tokenValidator } from './auth';

/**
* Create and export sub-router for '/api/users'
*/
export var router = Router( );

/**
* RESTful API ('CRUD'-style)
*   GET    /api/users/                  returns list of registered Users
*   PUT    /api/users/                  creates a new User
*
*   GET    /api/users/<id>              get User's information
*   POST   /api/users/<id>              (auth) update a single User
*
*/
router
  .get( '/', (req, res) => {
    // list users
    UserDataStore.listUsers()
      .then( users => {
        res.json( { users: users } );
      })
      .catch( (err) => { res.status( 500 ).send( err ); } );
  })
  .put( '/', (req, res) => {
    // create new user
    UserDataStore.createUser( <User>req.body )
      .then( user => {
        res.json( user );
      })
      .catch( (err) => { res.status( 500 ).send( err ); } );
  })
  .get( '/:username', (req, res) => {
    // get user
    UserDataStore.getUserByUsername( req.params.username )
      .then( user => {
        res.json( user );
      })
      .catch( (err) => { res.status( 404 ).send( err ); } );
  })
  .post( '/:username', tokenValidator, authenticateUser, (req, res) => {
    // Only logged-in user can update
    if ( req.params.username != req.user.username )
      res.sendStatus( 403 );
    else {
      // update user in datastore
      UserDataStore.updateUser( req.user.username, req.body )
        .then( user => {
          res.json( user );
        })
        .catch( (err) => { res.status( 404 ).send( err ); } );
      }
  });
