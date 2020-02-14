window.indexedDB = window.indexedDB || window.mozIndexedDB || 
	window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || 
	window.webkitIDBTransaction || window.msIDBTransaction;
	window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || 
	window.msIDBKeyRange

if (!window.indexedDB) {
	window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

/*
const topics = [
	{id: 1, name: "Ixtapa Mexican", dateAdded: new Date, dateUpdated: new Date},
	{id: 2, name: "Joe's All American Grille", dateAdded: new Date, dateUpdated: new Date},
	{id: 3, name: "Pepe's Pizza", dateAdded: new Date, dateUpdated: new Date},
	{id: 4, name: "P.F. Chang's China Bistro ", dateAdded: new Date, dateUpdated: new Date},
	{id: 5, name: "Steve's Seafood", dateAdded: new Date, dateUpdated: new Date}
];

const items = [
	{id: 1, topicID: 1, name: "Taco", rating: "5", getAgain: true, comments: "Chicken - prety good", dateAdded: new Date, dateUpdated: new Date},
	{id: 2, topicID: 1, name: "Quesadilla", rating: "4", getAgain: true, comments: "Shredded chicken", dateAdded: new Date, dateUpdated: new Date},
	{id: 3, topicID: 1, name: "Taco", rating: "4", getAgain: false, comments: "beef", dateAdded: new Date, dateUpdated: new Date},

	{id: 4, topicID: 2, name: "Chicken Tenders", rating: "5", getAgain: true, comments:'' , dateAdded: new Date, dateUpdated: new Date},
	{id: 5, topicID: 2, name: "Hamburger", rating: "5", getAgain: true, comments: "yum!", dateAdded: new Date, dateUpdated: new Date }
];
*/

var db;
var openRequest = window.indexedDB.open("toDoAgainList", 1);

openRequest.onerror = function(event) {
	console.log("onRequest error!");
	console.dir(event);
};

openRequest.onupgradeneeded = function(event) {

	console.log("running onupgradeneeded");
	var db = event.target.result;


	if (!db.objectStoreNames.contains("topics")) {
		var topicsOS = db.createObjectStore("topics", {keyPath: "id", autoIncrement: true});

		// create index so that we can query by it					
		topicsOS.createIndex("name", "name", {unique: false});
		topicsOS.createIndex("dateUpdated", "dateUpdated", {unique: false});

		// sample data
		//for (var i in topics) {
		//	topicsOS.add(topics[i]);
		//}

	}
	
	if (!db.objectStoreNames.contains("items")) {
		var itemsOS = db.createObjectStore("items", {keyPath: "id", autoIncrement: true});
		
		// create index so that we can query by it
		itemsOS.createIndex("topicID", "topicID", {unique: false});
		itemsOS.createIndex("name", "name", {unique: false});
		itemsOS.createIndex("dateUpdated", "dateUpdated", {unique: false});


		// sample data
		//for (var i in items) {
		//	itemsOS.add(items[i]);
		//}
	}
}

openRequest.onsuccess = function(event) {
	db = event.target.result;
	//console.log("openRequest success: " + db);
	//console.dir(db.objectStoreNames)
};


var myExtObject = (function() {

    return {

 		getAllTopics: function(theType){

			return new Promise( 
				function (resolve, reject) {

					var results = [];

					var transaction		= db.transaction(["topics"],"readonly");
					var topicsOS 	 	= transaction.objectStore("topics");
					var topicsCursor 	= topicsOS.openCursor();

					topicsCursor.onsuccess = function(event) {

						var cursor = event.target.result;

						if (cursor) {
							results.push(cursor.value);
							cursor.continue();
						}
					};

					transaction.oncomplete = function() {

						if (theType == 'recent') {

							//console.log ('recent', results);
							// sort
							results = results.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? 1 : -1);

							results = results.reverse();

							// pick top 3
							results = results.slice(0, 3);

							//console.log ('recent', results);

						} else {
							results = results.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ) ? 1 : -1);
						}


						let final = {
							error: false,
							resultObject: results
						}

						//console.log('transaction.oncomplete', results);
						resolve (final);
					}
				}
			)
		},

		getTopicByID: function(topicID) {

			return new Promise( 
				function (resolve, reject) {

					var results = [];

					var transaction = db.transaction(["topics"], "readonly");
					var objectStore = transaction.objectStore("topics");
					var myRequest 	= objectStore.get(Number(topicID));

					myRequest.onsuccess = function(event) {
						
						// Can also use event.target.result;
						if(myRequest.result) {
							//console.log("ID: " + myRequest.result.id + "; name: " + myRequest.result.name);
							results.push(myRequest.result);
						} else {
							//console.log("error", event);
							let final = {
								error: true,
								message: 'Topic not found'
							}
							resolve(final);
						}
					};
					
					transaction.oncomplete = function() {

						let final = {
							error: false,
							resultObject: results
						}

						//console.log('transaction.oncomplete', results);
						resolve (final);
					}
				}
			)
		},

		getItemsForTopic: function(theType, topicID) {
			
			return new Promise( 
				function (resolve, reject) {

					var results = [];

					var transaction = db.transaction(["items"],"readonly");
					var itemsOS 	= transaction.objectStore("items");
					var index 		= itemsOS.index("topicID");
					var range 		= IDBKeyRange.only(topicID);

					index.openCursor(range).onsuccess = function(event) {
						
						var cursor = event.target.result;
						
						if (cursor) {
							results.push(cursor.value);
							cursor.continue();
						}
					};

					transaction.oncomplete = function() {

						if (theType == 'recent') {

							//console.log ('recent', results);
							// sort
							results = results.sort((a, b) => (a.dateUpdated > b.dateUpdated) ? 1 : -1);

							results = results.reverse();

							// pick top 3
							results = results.slice(0, 3);

							//console.log ('recent', results);

						} else {
							results = results.sort((a, b) => (a.name.toUpperCase() > b.name.toUpperCase() ) ? 1 : -1);
						}

						let final = {
							error: false,
							resultObject: results
						}

						//console.log('transaction.oncomplete', results);
						resolve (final);
					}
				}
			)
		},
		addTopic: function(topicName) {

			return new Promise( 
				function (resolve, reject) {

					var objResults = {};

					var topic = {
						name: topicName,
						dateAdded: new Date().getTime(),
						dateUpdated: new Date().getTime()
					}

					var request = db.transaction(["topics"],"readwrite")
									.objectStore("topics")
									.add(topic);

					request.onerror = function(e) {
						console.log("Error", e.target.error.name);
					}

					request.onsuccess = function(e) {
						objResults.error = false;
						objResults.topicID = e.target.result;
						//console.log(objResults);
						resolve(objResults);
					}
				}
			)
		},

		topicUpdate: function(topicID, topicName) {

			return new Promise( 
				function (resolve, reject) {

					var objResults = {};

					var topic = {
						id: topicID,
						name: topicName,
						dateUpdated: new Date().getTime()
					}

					var request = db.transaction(["topics"],"readwrite")
									.objectStore("topics")
									.put(topic);

					request.onerror = function(e) {
						console.log("Error", e.target.error.name);
					}

					request.onsuccess = function(e) {
						//console.log(e.target.result);
						objResults.error = false;
						resolve(objResults);
					}
				}
			)
		},

		topicDelete: function(topicID) {

			return new Promise( 
				function (resolve, reject) {

					var objResults = {};
					
					var request = db.transaction(["topics"],"readwrite")
									.objectStore("topics")
									.delete(topicID);

					request.onerror = function(e) {
						console.log("Error", e.target.error.name);
					}

					request.onsuccess = function(e) {
						//console.log(e.target.result);
						objResults.error = false;
						resolve(objResults);
					}
				}
			)
		},

		getItemByID: function(itemID) {

			return new Promise( 
				function (resolve, reject) {

					var results = [];

					var transaction = db.transaction(["items"], "readonly");
					var objectStore = transaction.objectStore("items");
					var request 	= objectStore.get(Number(itemID));

					request.onsuccess = function(event) {
						
						// Can also use event.target.result;
						if(request.result) {
							//console.log(request.result);
							results.push(request.result);
						} else {
							//console.log("error", event);
							let final = {
								error: true,
								message: 'Item not found'
							}
							resolve(final);
						}
					};
					
					transaction.oncomplete = function() {

						let final = {
							error: false,
							resultObject: results
						}

						//console.log('transaction.oncomplete', results);
						resolve (final);
					}
				}
			)
		},

		itemAdd: function(objItem) {

			// @@todo / potential upgrade / to be improved:
			// Update the date of the Topic;
			// Need to get the Topic Name first or else it will save it as a blank
			// a promise is returned; need to unwrap the promise with .then
			this.getTopicByID(objItem.topicID)
				.then( res=>
					this.updateTopic(objItem.topicID, res.resultObject[0]['name'] )
				);

			return new Promise( 
				function (resolve, reject) {

					var objResults = {};

					var item = {
						topicID: 		objItem.topicID,
						name: 			objItem.name,
						rating: 		objItem.rating,
						getAgain: 		objItem.getAgain,
						comments: 		objItem.comments,
						dateAdded: 		new Date().getTime(),
						dateUpdated: 	new Date().getTime()
					}

					var request = db.transaction(["items"],"readwrite")
									.objectStore("items")
									.add(item);

					request.onerror = function(e) {
						console.log("Error", e.target.error.name);
					}


					request.onsuccess = function(e) {
						// by default, the newly created itemID is returned
						// *instead* return the topicID
						objResults.error = false;
						objResults.topicID = objItem.topicID;
						//console.log('objres',objResults);
						resolve(objResults);
						
					}
				}
			)
		},

		itemUpdate: function(objItem) {


			// @@todo / potential upgrade / to be improved:
			// Update the date of the Topic;
			// Need to get the Topic Name first or else it will save it as a blank
			// a promise is returned; need to unwrap the promise with .then
			this.getTopicByID(objItem.topicID)
				.then( res=>
					this.updateTopic(objItem.topicID, res.resultObject[0]['name'] )
				);


			// difference between Add and Update
			// add: id
			// change: .add to .put
			// keep dateAdded (don't remove) or else it gets removed
			return new Promise( 
				function (resolve, reject) {

					var objResults = {};

					var item = {
						id: 			objItem.id,
						topicID: 		objItem.topicID,
						name: 			objItem.name,
						rating: 		objItem.rating,
						getAgain: 		objItem.getAgain,
						comments: 		objItem.comments,
						dateAdded: 		objItem.dateAdded,
						dateUpdated: 	new Date().getTime()
					}

					var request = db.transaction(["items"],"readwrite")
									.objectStore("items")
									.put(item);

					request.onerror = function(e) {
						console.log("Error", e.target.error.name);
					}

					request.onsuccess = function(e) {
						// by default, the newly created itemID is returned
						// *instead* return the topicID
						objResults.error = false;
						objResults.topicID = objItem.topicID;
						//console.log('objres',objResults);
						resolve(objResults);
					}
				}
			)
		},

		itemDelete: function(itemID) {

			return new Promise( 
				function (resolve, reject) {

					var objResults = {};
					
					var request = db.transaction(["items"],"readwrite")
									.objectStore("items")
									.delete(itemID);

					request.onerror = function(e) {
						console.log("Error", e.target.error.name);
					}

					request.onsuccess = function(e) {
						//console.log(e.target.result);
						objResults.error = false;
						resolve(objResults);
					}
				}
			)
		}

	}

})(myExtObject||{});





/*

function searchItem(event) {

	var results = [];

	var transaction = db.transaction(["items"],"readonly");
	var itemsOS 	= transaction.objectStore("items");
	var index 		= itemsOS.index("name");

	var search 		= "TAco";

	// searching is case-sensitive.
	// solution is to use an upper/lower bound range
	var searchLower = search.toUpperCase();
	var searchUpper = search.toLowerCase() + 'z';
	var range 		= IDBKeyRange.bound(searchLower, searchUpper);

	index.openCursor(range).onsuccess = function(event) {

		var cursor = event.target.result;
		
		if (cursor) {
			results.push(cursor.value);
			cursor.continue();
		}
	};

	transaction.oncomplete = function() {
		console.dir(results);
	}
}
*/