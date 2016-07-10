$(document).foundation()
var tabsElem = new Foundation.Tabs($('#nav-tabs'), {});

/**
********************************************************************************
*/
function logNL( s ) {
  log( s ); log( '\n' );
}

function log( s ) {
  var logEl = $('#log');

  if ( typeof s == "object" )
    s = JSON.stringify( s, null, 2 );

  logEl.val( $('#log').val() + s );
  logEl.scrollTop(logEl[0].scrollHeight);
}

/**
********************************************************************************
*/
var authToken = null;

function doJSON( type, url, data ) {
  console.log( type + " " + url );
  if ( data )
    console.log( data );

  return new Promise( function( resolve, reject ) {
    jQuery.ajax( {
        url: url,
        type: type,
        headers: authToken && { "Authorization": "Bearer " + authToken },
        data: data && JSON.stringify(data),
        dataType: data && "json",
        contentType: "application/json",
        processData: false,
        success: function( result ) { resolve( result ); },
        error: function( err ) { logNL( 'Error: ' + err.status + " - " + err.responseText ); reject( err ); },
    });
  })
}

function getJSON( url) {
  return doJSON( "GET", url );
}

function postJSON( url, data, auth ) {
  return doJSON( "POST", url, data, auth );
}

function putJSON( url, data, auth ) {
  return doJSON( "PUT", url, data, auth );
}

/**
*
*/
function listUsers() {
  log( 'listUsers: ' );

  getJSON( "api/users" )
    .then( function( data ) {
      let users = data.users;

      logNL( users.length + '=>' );

      for( var i = 0; i < users.length; ++i )
        logNL( '  ' + JSON.stringify( users[i] ) );
    });
}

/**
*
*/
function authLogin() {
  var auth = {
    username: $('#user-username').val(),
    password: $('#user-password').val()
  }

  log( 'authLogin: ' ); logNL( auth.username );

  postJSON( "api/auth/login", auth )
    .then( function( data ) {
      if ( data.success ) {
        authToken = data.token;
        logNL( 'Logged In: ' + data.token );
      }
      else
        alert( 'Incorrect Password');
    } );
}

/**
*
*/
function authLogout() {
  logNL( 'authLogout' );

  postJSON( "api/auth/logout" )
    .then( function( data ) {
      if ( data.success ) {
        authToken = null;
        logNL( 'Logged Out' );
      }
    } );
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

  putJSON( "api/users", user )
    .then( function( data ) {
      let user = data;

      log( '=> ' ); logNL( user );
    });
}

/**
*
*/
function createDocument() {
  var doc = {
    id: $('#document-id').val(),
    title: $('#document-title').val(),
    contents: $('#document-contents').val(),
  }

  log( 'createDocument: ' ); logNL( JSON.stringify( doc ) );

  putJSON( "api/documents", doc )
    .then( function( data ) {
      let doc = data;

      $('#document-id').val( doc.id );

      log( '=> ' ); logNL( doc );
    });
}


/**
*
*/
function listDocuments() {
  log( 'listDocuments: ' );

  // Get User's documents
  getJSON( "api/documents" )
    .then( function( data ) {
      let docs = data.documents;

      logNL( docs.length + '=>' );

      for( var i = 0; i < docs.length; ++i )
        logNL( '  ' + JSON.stringify( docs[i] ) );
    });
}

/**
*
*/
function getDocument() {
  var id = $('#document-id').val();

  log( 'getDocument: ' + id );

  getJSON( "api/documents/" + id )
    .then( function( doc ) {
      $('#document-id').val( doc.id );
      $('#document-title').val( doc.title );
      $('#document-contents').val( doc.contents );

      logNL( doc );
    });
}
