import { Router, Request, Response, RequestHandler } from 'express';
import { User, UserDataStore } from '../services/user-datastore';

/**
* Express middleware to authenticate a user
*   For now, just retrieves a 'user' cookie, that is the logged-in username
*   If OK, the 'req' object will gain a user property on exit
*   If NOK, fail with a 401 (unauthorized) error code
*/
export function authenticateUser( req, res, next ) {

  // Just get 'user' cookie, it's the username
  if ( req.cookies.user ) {
    req.user = req.cookies.user;

    next();
  }
  else
    res.sendStatus( 401 );
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
  .post( '/login/', (req, res) => {
    // check User password
    UserDataStore.checkPassword( req.body.username, req.body.password )
      .then( ok => {
        let username = req.body.username;

        if ( ok ) {
          // set username cookie, will be used by authenticateUser middleware
          res.cookie( 'user', username );

          res.json( { success: true } );
        }
        else
          res.sendStatus( 401 );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .post( '/logout/', authenticateUser, (req, res) => {
    // clear username cookie
    res.clearCookie( 'user' );

    res.json( { success: true } );
  });
