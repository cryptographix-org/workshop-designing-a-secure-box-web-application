import * as crypto from "crypto";

const SALT_LEN = 64;
const ITERATIONS = 10000;
const HASH_LEN = 256;

export class UserAuthenticator {
  private static genRandom( len ): Promise<Buffer> {
    return new Promise<Buffer>( (resolve, reject ) => {
      crypto.randomBytes( len, (err, buffer) => {

        if ( err )
          reject( err );
        else
          resolve( buffer );
      } );
    })
  }

  private static genPBKDF( salt, iterations, password, keylen ): Promise<Buffer> {
    return new Promise<Buffer>( (resolve, reject ) => {

      crypto.pbkdf2( password, salt, ITERATIONS, keylen, 'sha256', (err, key) => {

        if ( err )
          reject( err );
        else
          resolve( key );
      } );
    })
  }

  static hashPassword( password: string ): Promise<string> {
    let hash = 'sha256$';

    return UserAuthenticator.genRandom( SALT_LEN / 8 )
      .then( ( salt: Buffer ) => {
        hash += salt.toString('base64');

        return UserAuthenticator.genPBKDF( salt, ITERATIONS, password, 32 );
      } )
      .then( ( key ) => {
        hash += '$' + key.toString( 'base64' );

        console.log( hash );

        return Promise.resolve<string>( hash );
      });
  }

  static checkPassword( password: string, hash: string ): Promise<boolean> {
    let parts = hash.split( '$' );

    let salt = new Buffer( parts[1], 'base64' );
    let key = new Buffer( parts[2], 'base64' );

    return UserAuthenticator.genPBKDF( salt, ITERATIONS, password, 32 )
      .then( ( testKey ) => {

        console.log( hash + ' ? ' + testKey.toString('base64' ) );
        return Promise.resolve<boolean>( key.equals( testKey ) );
      });
  }
}
