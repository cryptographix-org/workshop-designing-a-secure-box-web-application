import { Router, Request, Response, RequestHandler } from 'express';
import { User, UserDataStore } from '../services/user-datastore';

import * as expressJWT from "express-jwt";
import * as jwt from "jsonwebtoken";

const TOKEN_SECRET = 'CryptoGraphix';

export var tokenValidator = expressJWT( { secret: TOKEN_SECRET } );

/**
* Express middleware to authenticate a user
*   For now, just retrieves a 'user' cookie, that is the logged-in username
*   If OK, the 'req' object will gain a user property on exit
*   If NOK, fail with a 401 (unauthorized) error code
*/
export function authenticateUser( req, res, next ) {

  // We need a user (extracted and validated by express-jwt)
  if ( req.user ) {
    console.log( req.user );

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
          jwt.sign( { "username": username }, TOKEN_SECRET, { algorithm: 'HS256' },  (err, tok: string) => {
            if ( err ) {
              res.sendStatus( 401 );
              console.log( 'Sign: ' + err );
              return;
            }
            res.json( { success: true, token: tok } );
          } );
        }
        else
          res.sendStatus( 401 );
      })
      .catch( (err) => { res.status( 403 ).send( err ); } );
  })
  .post( '/logout/', tokenValidator, authenticateUser, (req, res) => {

    res.json( { success: true } );
  });
