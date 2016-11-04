var customWidgetModule = angular.module('CustomWidget');

customWidgetModule.factory('CustomWidgetService', ['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var customArray;

		return{
			initDB:initDB,
			getAllEntry:getAllEntry,
			addNewEntry:addNewEntry,
			updateEntry:updateEntry,
			deleteEntry:deleteEntry
		}

		function initDB(){
			$ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			  }
			  catch(e) { 
			  	console.log("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS custom_list (id integer primary key autoincrement, header string, text string)";

			  try{
			  	runQuery(query,[],function(res) {
			      console.log("table created custom_list");
			   }, function (err) {
			      console.log("table custom_list error "+err);
			   }); 

			  }catch(e){
			  	console.log(e.message);
			  }

		  }.bind(this));
		}

		function getAllEntry(){
			try{
				var deferred = $q.defer();
		 		var query = "SELECT * from custom_list";
				runQuery(query,[],function(response){
					//Success Callback
					console.log(response);
					customArray = response.rows;
					deferred.resolve(response);
				},function(error){
					console.log("Error in gettingentry");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in getAllEntry "+e.message);
			}
		}

		function addNewEntry(header, text){
			try{
				var deferred = $q.defer();
				var query = "INSERT INTO custom_list (header, text) VALUES (?,?)";
				runQuery(query,[header, text],function(response){
					//Success Callback
					console.log(response);
					deferred.resolve(response);
				},function(error){
					console.log("Error in add new row");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in addNewEntry "+e.message);

			}
		}

		function updateEntry(text,id){
			var deferred = $q.defer();
			var query = "UPDATE custom_list SET text = ? WHERE id = ?";
			try{
				runQuery(query,[text, id],function(response){
		
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log("Error in updating text");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				console.log("Error in update text "+e.message);
			}
		}

		function deleteEntry(header){
			var deferred = $q.defer();
			var query = "DELETE from custom_list WHERE header = ?";
			try{
				runQuery(query,[header],function(response){
		
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log("Error in deleting entry");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				console.log("Error in deleting entry "+e.message);
			}
		}

//--------------------------------------------------------------------//
//------------------------QUERY FUNCTIONS-----------------------------//
//--------------------------------------------------------------------//		

		function runQuery(query,dataArray,successCb,errorCb)
		{
		  $ionicPlatform.ready(function() {	
		
		  		$cordovaSQLite.execute(db, query, dataArray).then(function(res) {
			      successCb(res);
			//      console.log("success in runQuery function "+res);
			    }, function (err) {
			      errorCb(err);
			      console.log("error in runQuery function "+err);
			    });

		  }.bind(this));
		}

}]);