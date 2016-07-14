"user strict";

var KeyDatabase = {
  // resolve prefixes of window.IDB objects
  indexedDB: window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
  IDBTransaction: window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
  IDBKeyRange: window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange,

  openKeyDB: function() {
    if (!KeyDatabase.indexedDB) {
      alert("Your browser doesn't support a stable version of IndexedDB.");

      return Promise.reject( "No Key Database" );
    }
    else {
      var request = window.indexedDB.open( "keyDatabase", 1 );

      return new Promise( function( resolve, reject ) {
        request.onerror = function( event ) {
          console.log("error: " + event );
          reject( error );
        };

        request.onupgradeneeded = function( event ) {
          var db = event.target.result;
          var objectStore = db.createObjectStore( "userKeys", { keyPath: "id" } );
        };

        request.onsuccess = function(event) {
          var db = request.result;

          console.log("success: "+ db);

          resolve( db );
        };
      } );
    }
  },

  listKeys: function() {
    return KeyDatabase.openKeyDB()
      .then( function( db ) {
        var keyRecords = [];

        return new Promise( function( resolve, reject ) {
          var keyStore = db.transaction( ["userKeys"] ).objectStore( "userKeys" );
          var request = keyStore.openCursor();

          request.onerror = function( event ) {
            console.log("error: " + event );
            reject( error );
          };

          request.onsuccess = function(event) {
            var cursor = event.target.result;

            if ( cursor ) {
              console.log( "Key id " + cursor.key + " for " + cursor.value.username + ", Key: " + cursor.value.key );
              keyRecords.push( cursor.value );
              cursor.continue();
            }
            else {
              console.log("success: "+ keyRecords );

              resolve( keyRecords );
            }
          };
        } ); // promise
      } );
  },

  readKey: function( id ) {
    return KeyDatabase.openKeyDB()
      .then( function( db ) {
        return new Promise( function( resolve, reject ) {
          var keyStore = db.transaction( ["userKeys"] ).objectStore( "userKeys" );
          var request = keyStore.get( id );

          request.onerror = function( event ) {
            console.log("error: " + event );
            reject( error );
          };

          request.onsuccess = function(event) {
            var keyRecord = request.result;

            console.log( "read success: "+ keyRecord );

            resolve( keyRecord );
          };
        } ); // promise
      } );
  },

  insertKey: function( id, username, key ) {
    return KeyDatabase.openKeyDB()
      .then( function( db ) {
        return new Promise( function( resolve, reject ) {
          var keyStore = db.transaction( ["userKeys"], "readwrite" ).objectStore( "userKeys" );
          var request = keyStore.add( { id: id, username: username, key: key } )

          request.onerror = function( event ) {
            console.log("error: " + event );
            reject( error );
          };

          request.onsuccess = function(event) {
            var keyRecord = request.result;

            console.log( "insert success: "+ keyRecord );

            resolve( keyRecord );
          };
        } ); // promise
      } );
  },

}

/*var db;

function read() {
  var transaction = db.transaction(["employee"]);
  var objectStore = transaction.objectStore("employee");
  var request = objectStore.get("00-03");

  request.onerror = function(event) {
     alert("Unable to retrieve daa from database!");
  };

  request.onsuccess = function(event) {
     // Do something with the request.result!
     if(request.result) {
        alert("Name: " + request.result.name + ", Age: " + request.result.age + ", Email: " + request.result.email);
     }

     else {
        alert("Kenny couldn't be found in your database!");
     }
  };
}

function readAll() {
  var objectStore = db.transaction("employee").objectStore("employee");

  objectStore.openCursor().onsuccess = function(event) {
     var cursor = event.target.result;

     if (cursor) {
        alert("Name for id " + cursor.key + " is " + cursor.value.name + ", Age: " + cursor.value.age + ", Email: " + cursor.value.email);
        cursor.continue();
     }

     else {
        alert("No more entries!");
     }
  };
}

function add() {

  var request = db.transaction(["employee"], "readwrite")
  .objectStore("employee")
  .add({ id: "00-03", name: "Kenny", age: 19, email: "kenny@planet.org" });

  request.onsuccess = function(event) {
     alert("Kenny has been added to your database.");
  };

  request.onerror = function(event) {
     alert("Unable to add data\r\nKenny is aready exist in your database! ");
  }
}

function remove() {
  var request = db.transaction(["employee"], "readwrite")
  .objectStore("employee")
  .delete("00-03");

  request.onsuccess = function(event) {
     alert("Kenny's entry has been removed from your database.");
  };
}*/
