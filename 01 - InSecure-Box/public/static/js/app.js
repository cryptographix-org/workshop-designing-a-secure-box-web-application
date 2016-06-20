$(document).foundation()
var elem = new Foundation.Tabs($('#nav-tabs'), {});

function doJSON( type, url, data ) {
  return new Promise( function( resolve, reject ) {
    jQuery.ajax( {
        url: url,
        type: type,
        data: data && JSON.stringify(data),
        dataType: data && "json",
        contentType: "application/json",
        processData: false,
        success: function( result ) { resolve( result ); },
        failure: function( err ) { reject( result ); },
    });
  })
}

function getJSON( url ) {
  return doJSON( "GET", url );
}

function postJSON( url, data ) {
  return doJSON( "POST", url, data );
}

function putJSON( url, data ) {
  return doJSON( "PUT", url, data );
}

/**
*
*/
function listUsers() {
  log( 'listUsers: ' );

  getJSON( "/api/users" )
    .then( function( data ) {
      let users = JSON.parse( data );

      logNL( users.length + '=>' );

      for( var i = 0; i < users.length; ++i )
        logNL( '  ' + JSON.stringify( users[i] ) );
    })
    .catch( function( err ) {
      logNl( 'Error: ' + err );
    });
}

/**
*
*/
function checkPassword() {
  var username = $('#user-username').val();
  var password = $('#user-password').val();

  log( 'checkPassword: ' ); logNL( username );

  postJSON( "/api/check/", { username: username, password: password } )
    .then( function( data ) {
      if ( data.success )
        alert( 'Password OK');
      else
        alert( 'Incorrect Password');
    } )
    .catch( function( err ) {
      logNl( 'Error: ' + err );
    });
}

/**
*
*/
function createUser() {
  var user = {
    username: $('#user-username').val(),
    name: $('#user-name').val(),
    email: $('#user-email').val(),
    password: $('#user-password').val(),
  }

  log( 'createUser: ' ); logNL( JSON.stringify( user ) );

  putJSON( "/api/users",  user )
    .then( function( data ) {
      let user = data;

      log( '=> ' ); logNL( user );
    })
    .catch( function( err ) {
      logNl( 'Error: ' + err );
    });
}

function addAuth( obj ) {
  obj.username = $('#user-username').val();
  obj.password = $('#user-password').val();

  return obj;
}
/**
*
*/
function createDocument() {
  var doc = {
    id: $('#document-id').val(),
    title: $('#document-title').val(),
    content: $('#document-contents').val(),
  }


  log( 'createDocument: ' ); logNL( JSON.stringify( doc ) );

  putJSON( "/api/documents",  addAuth( doc ) )
    .then( function( data ) {
      let doc = data;

      $('#document-id').val( doc.id );
      log( '=> ' ); logNL( doc );
    })
    .catch( function( err ) {
      logNl( 'Error: ' + err );
    });
}


/**
*
*/
function listDocuments() {
  log( 'listDocuments: ' );

  getJSON( "/api/documents" )
    .then( function( data ) {
      let users = JSON.parse( data );

      logNL( users.length + '=>' );

      for( var i = 0; i < users.length; ++i )
        logNL( '  ' + JSON.stringify( users[i] ) );
    })
    .catch( function( err ) {
      logNl( 'Error: ' + err );
    });
}


/**
********************************************************************************
*/
function logNL( s ) {
  log( s ); log( '\n' );
}

function log( s ) {
  if ( typeof s == "object" )
    s = JSON.stringify( s, null, 2 );

  $('#log').val( $('#log').val() + s );
}
