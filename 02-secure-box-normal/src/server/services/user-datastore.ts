import { User } from '../models/user';
export { User };

import { UserAuthenticator } from '../services/user-auth';

//import { cuid } from 'cuid';
var cuid = require( 'cuid' );

/**
*
*/
export class UserDataStore {
  /**
  * Our memory-base of users
  * Maps username -> User
  */
  static users: Map<string, User> = new Map<string, User>();

  static listUsers( ): Promise<User[]> {
    let users = [];

    UserDataStore.users.forEach( ( v,k ) => { users.push( v ); } );

    return Promise.resolve<User[]>( users );
  }

  static getUserByUsername( username: string ): Promise<User> {
    return new Promise<User>( (resolve, reject) => {
      let user = UserDataStore.users.get( username );

      // Found user ?
      if ( user )
        resolve( user );
      else
        reject( 'User ' + username + ' not found' );
    })
  }

  static updateUser( username: string, attributes: {} ): Promise<User> {
    return new Promise<User>( (resolve, reject) => {
      let user = UserDataStore.users.get( username );

      // Found user ?
      if ( user ) {
        // Copy new attributes to memory-base
        for( let attr in attributes ) {
          user[ attr ] = attributes[ attr ];
        }

        resolve( user );
      }
      else
        reject( 'User ' + username + ' not found' );
    })
  }

  /**
  *
  */
  static checkPassword( username: string, password: string ): Promise<boolean> {
    // lookup user, and check password ..
    let user = UserDataStore.users.get( username );
    if ( !user )
      return Promise.resolve<boolean>( false );

    return UserAuthenticator.checkPassword( password, user.password );
  }

  /**
  *
  */
  static createUser( newUser: User ): Promise<User> {

    if ( UserDataStore.users.get( newUser.username ) )
      return Promise.reject<User>( 'User already exists' );

    // for now, just fabricate a user object ...
    let user = {
      username: newUser.username,
      id: cuid(),
      name: newUser.name || 'User' + newUser.username,
      email: newUser.email,
      password: ''
    }

    return UserAuthenticator.hashPassword( newUser.password )
      .then( ( hash ) => {

        user.password = hash;

        // save it
        UserDataStore.users.set( user.username, user );

        return Promise.resolve<User>( user );
      });
  }
}


UserDataStore.createUser( { username: 'sean', password: '1234', name: 'Sean Michael'} );
UserDataStore.createUser( { username: 'fisl', password: '9999', name: 'FISL'} );
