$(document).foundation()
var elem = new Foundation.Tabs($('#nav-tabs'), {});

function getJSON( url, data ) {
  return new Promise( function( resolve, reject ) {
    jQuery.ajax( {
        url: url,
        type: "GET",
        contentType: "application/json",
        processData: false,
        success: function( result ) { resolve( result ); },
        error: function( a,b, err ) { reject( err ); },
    });
  })
}

function postJSON( url, data ) {
  return new Promise( function( resolve, reject ) {
    jQuery.ajax( {
        url: url,
        type: "POST",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        processData: false,
        success: function( result ) { resolve( result ); },
        failure: function( err ) { reject( result ); },
    });
  })
}

function putJSON( url, data ) {
  return new Promise( function( resolve, reject ) {
    jQuery.ajax( {
        url: url,
        type: "PUT",
        data: JSON.stringify(data),
        dataType: "json",
        contentType: "application/json",
        processData: false,
        success: function( result ) { resolve( result ); },
        failure: function( err ) { reject( result ); },
    });
  })
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

  $.postJSON( "/api/check/", { username: username, password: password }, function( data ) {
    if ( data.success )
      alert( 'Password OK');
    else
      alert( 'Incorrect Password');
  } )
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

  $.putJSON( "/api/users",  user, function( data ) {
    let user = data;

    log( '=> ' ); logNL( user );
  })
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

  $.putJSON( "/api/documents",  addAuth( doc ), function( data ) {
    let doc = data;

    $('#document-id').val( doc.id );
    log( '=> ' ); logNL( doc );
  })
}


/**
*
*/
function listDocuments() {
  log( 'listDocuments: ' );

  $.getJSON( "/api/documents", function( data ) {
    let users = JSON.parse( data );

    logNL( users.length + '=>' );

    for( var i = 0; i < users.length; ++i )
      logNL( '  ' + JSON.stringify( users[i] ) );
  })
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
