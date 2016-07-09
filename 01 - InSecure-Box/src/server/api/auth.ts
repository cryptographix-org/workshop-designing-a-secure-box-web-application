import { Router, Request, Response, RequestHandler } from 'express';
import { User, UserDataStore } from '../services/user-datastore';

/**
* Express middleware to authenticate a user
*   BODY (json) must contain username, password. Both props will be removed on exit.
*   Password will be checked for that user,
*   If OK, the 'req' object will gain a user property on exit
*   If NOK, fail with a 401 (unauthorized) error code
*/
export function authenticateUser( req, res, next ) {
  // get document from datastore
  UserDataStore.checkPassword( req.body.username, req.body.password )
    .then( ok => {
      let username = req.body.username;

      delete req.body.password;
      delete req.body.username;

      if ( ok ) {
        req.user = username;

        next();
      }
      else
        res.sendStatus( 401 );
    })
    .catch( (err) => { res.status( 403 ).send( err ); } );
}

/**
* Create and export sub-router for '/api/auth'
*/
export var router = Router( );

/**
* RESTful API
*   POST   /api/auth/login                  login a user
*   POST   /api/auth/logout/                logout a user
*/
router
  .post( '/login/', authenticateUser, (req, res) => {
    // OK - For now, do nothing
    res.json( { success: true } );
  })
  .post( '/logout/', authenticateUser, (req, res) => {
    // OK - For now, do nothing
    res.json( { success: true } );
  });
