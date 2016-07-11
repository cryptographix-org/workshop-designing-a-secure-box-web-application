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

  encryptDocument( doc.contents )
    .then( function( encryptedDoc ) {
      doc.contents = encryptedDoc;

      return putJSON( "api/documents", doc );
    } )
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
      $('#document-contents').val( decryptDocument( doc.contents ) );

      return decryptDocument( doc.contents )
      logNL( doc );
    })
    .then( function( plainDoc ) {
      $('#document-contents').val( plainDoc );
    })
}

var keyPair = {
  public: null,
  private: null,
};

function checkKeys() {
  var rsa_key =
  {
    "kty": "RSA",
    "n":   "oahUIoWw0K0usKNuOR6H4wkf4oBUXHTxRvgb48E-BVvxkeDNjbC4he8rUW"+
           "cJoZmds2h7M70imEVhRU5djINXtqllXI4DFqcI1DgjT9LewND8MW2Krf3S"+
           "psk_ZkoFnilakGygTwpZ3uesH-PFABNIUYpOiN15dsQRkgr0vEhxN92i2a"+
           "sbOenSZeyaxziK72UwxrrKoExv6kc5twXTq4h-QChLOln0_mtUZwfsRaMS"+
           "tPs6mS6XrgxnxbWhojf663tuEQueGC-FCMfra36C9knDFGzKsNa7LZK2dj"+
           "YgyD3JR_MB_4NUJW_TqOQtwHYbxevoJArm-L5StowjzGy-_bq6Gw",
    "e":   "AQAB",
    "d":   "kLdtIj6GbDks_ApCSTYQtelcNttlKiOyPzMrXHeI-yk1F7-kpDxY4-WY5N"+
           "WV5KntaEeXS1j82E375xxhWMHXyvjYecPT9fpwR_M9gV8n9Hrh2anTpTD9"+
           "3Dt62ypW3yDsJzBnTnrYu1iwWRgBKrEYY46qAZIrA2xAwnm2X7uGR1hghk"+
           "qDp0Vqj3kbSCz1XyfCs6_LehBwtxHIyh8Ripy40p24moOAbgxVw3rxT_vl"+
           "t3UVe4WO3JkJOzlpUf-KTVI2Ptgm-dARxTEtE-id-4OJr0h-K-VFs3VSnd"+
           "VTIznSxfyrj8ILL6MG_Uv8YAu7VILSB3lOW085-4qE3DzgrTjgyQ",
    "p":   "1r52Xk46c-LsfB5P442p7atdPUrxQSy4mti_tZI3Mgf2EuFVbUoDBvaRQ-"+
           "SWxkbkmoEzL7JXroSBjSrK3YIQgYdMgyAEPTPjXv_hI2_1eTSPVZfzL0lf"+
           "fNn03IXqWF5MDFuoUYE0hzb2vhrlN_rKrbfDIwUbTrjjgieRbwC6Cl0",
    "q":   "wLb35x7hmQWZsWJmB_vle87ihgZ19S8lBEROLIsZG4ayZVe9Hi9gDVCOBm"+
           "UDdaDYVTSNx_8Fyw1YYa9XGrGnDew00J28cRUoeBB_jKI1oma0Orv1T9aX"+
           "IWxKwd4gvxFImOWr3QRL9KEBRzk2RatUBnmDZJTIAfwTs0g68UZHvtc",
    "dp":  "ZK-YwE7diUh0qR1tR7w8WHtolDx3MZ_OTowiFvgfeQ3SiresXjm9gZ5KL"+
           "hMXvo-uz-KUJWDxS5pFQ_M0evdo1dKiRTjVw_x4NyqyXPM5nULPkcpU827"+
           "rnpZzAJKpdhWAgqrXGKAECQH0Xt4taznjnd_zVpAmZZq60WPMBMfKcuE",
    "dq":  "Dq0gfgJ1DdFGXiLvQEZnuKEN0UUmsJBxkjydc3j4ZYdBiMRAy86x0vHCj"+
           "ywcMlYYg4yoC4YZa9hNVcsjqA3FeiL19rk8g6Qn29Tt0cj8qqyFpz9vNDB"+
           "UfCAiJVeESOjJDZPYHdHY8v1b-o-Z2X5tvLx-TCekf7oxyeKDUqKWjis",
    "qi":  "VIMpMYbPf47dT1w_zDUXfPimsSegnMOA1zTaX7aGk_8urY6R8-ZW1FxU7"+
           "AlWAyLWybqq6t16VFd7hQd0y6flUK4SlOydB61gwanOsXGOAOv82cHq0E3"+
           "eL4HrtZkUuKvnPrMnsUUFlfUdybVzxyjz9JF_XyaY14ardLSjf4L_FNY"
  };
  keyPair.public = Jose.Utils.importRsaPublicKey(rsa_key, "RSA-OAEP");
  keyPair.private = Jose.Utils.importRsaPrivateKey(rsa_key, "RSA-OAEP");

/*  $.indexedDB("cryptoGraphix")
    .done( function( db, event ) {
      return db.objectStore("userKeys").add( keyPair, 'sean' );
    } )
    .done( function( db, event ) {
      console.log( result );
      console.log( event );
    } )
    .fail( function( error, event ) {
      console.log( error );
      console.log( event );

    } );*/
}

function encryptDocument( plainDoc ) {
  var cryptographer = new Jose.WebCryptographer();

  var encrypter = new JoseJWE.Encrypter( cryptographer, keyPair.public );

  return encrypter.encrypt( plainDoc )
    .then(function(result) {

      console.log(result);
      return result;
    })
    .catch(function(err) {
      console.error(err);
    });
}

/**
*
*/
function decryptDocument( encryptedDoc ) {
  var cryptographer = new Jose.WebCryptographer();

  var decrypter = new JoseJWE.Decrypter( cryptographer, keyPair.private );

  return decrypter.decrypt( encryptedDoc )
    .then(function(result) {

      console.log(result);
      return result;
    })
    .catch(function(err) {
      console.error(err);
    });
}

checkKeys();

encryptDocument( 'A find document you got us in' )
  .then( function( jweDoc ) {
    return decryptDocument( jweDoc );
  } )
  .then( function( plainDoc ) {
    console.log( "Final: " + plainDoc );
  } );
