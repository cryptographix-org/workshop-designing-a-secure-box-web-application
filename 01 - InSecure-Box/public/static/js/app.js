$(document).foundation()
var elem = new Foundation.Tabs($('#nav-tabs'), {});

jQuery.extend({
    postJSON: function(url, data, success) {
        return jQuery.ajax( {
            url: url,
            type: "POST",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            processData: false,
            success: success
        });
    }
});

jQuery.extend({
    putJSON: function(url, data, success) {
        return jQuery.ajax( {
            url: url,
            type: "PUT",
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json",
            processData: false,
            success: success
        });
    }
});


function listUsers() {
  log( 'listUsers: ' );

  $.getJSON( "/api/users", function( data ) {
    let users = JSON.parse( data );

    logNL( users.length + '=>' );

    for( var i = 0; i < users.length; ++i )
      logNL( '  ' + JSON.stringify( users[i] ) );
  })
}

function checkPassword() {
  var username = $('#user-username').val();
  var password = $('#user-password').val();

  log( 'checkPassword: ' ); logNL( username );

  $.postJSON( "/api/check/"+username, { password: password }, function( data ) {
    if ( data.success )
      alert( 'Password OK');
    else
      alert( 'Incorrect Password');
  } )
}

function createUser() {
  var user = {
    username: $('#user-username').val(),
    name: $('#user-name').val(),
    email: $('#user-email').val(),
    password: $('#user-password').val(),
  }

  log( 'createUsers: ' ); logNL( JSON.stringify( user ) );

  $.putJSON( "/api/users",  user, function( data ) {
    let user = data;

    log( '=> ' ); logNL( user );
  })
}

function logNL( s ) {
  log( s ); log( '\n' );
}

function log( s ) {
  if ( typeof s == "object" )
    s = JSON.stringify( s, null, 2 );

  $('#log').val( $('#log').val() + s );
}
