var routinesListModule = angular.module('RoutinesList');

routinesListModule.factory('RoutinesService',['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var routinesList;
		return {
			initDB:initDB,
			getAllRoutines: getAllRoutines,
			addNewRoutine: addNewRoutine,
			deleteRoutine: deleteRoutine,
			getRoutine:getRoutine
		}

		function initDB() {
		  $ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
		//	  	console.log("opened db ");
			  }
			  catch(e) { 
			  	console.log("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS routines_list (id integer primary key autoincrement, name string , no_of_entries integer)";
			  runQuery(query,[],function(res) {
			      console.log("table created ");
			//      console.log("table created ");
			   }, function (err) {
			      console.log(err);
			      console.log("error creating table "+err);
			   }); 
			   
		  }.bind(this));
		}

		function getAllRoutines(){

			var deferred = $q.defer();
			var query = "SELECT * from routines_list";

			runQuery(query,[],function(response){
				//Success Callback
				console.log(response);
				routinesList = response.rows;
				deferred.resolve(response);
			},function(error){
				//Error Callback
				console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function addNewRoutine(name) {
			console.log('adding new routine :'+name);
			var deferred = $q.defer();
			var query = "INSERT INTO routines_list (name, no_of_entries) VALUES (?,?)";
			runQuery(query,[name,0],function(response){
				//Success Callback
				console.log(response);
				deferred.resolve(response);
			},function(error){
				//Error Callback
				console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function deleteRoutine(id) {
			var deferred = $q.defer();
			var query = "DELETE FROM routines_list WHERE id = ?";
			runQuery(query,[id],function(response){
				//Success Callback
				console.log(response);
				deferred.resolve(response);
			},function(error){
				//Error Callback
				console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}
//----------------------------------------------------------------
//--------------------to get specific routine---------------------
//----------------------------------------------------------------
		function getRoutine(id) {
			var routine;
			if(routinesList){
				for(var i=0;i<routinesList.length;i++)
				{
					if(routinesList.item(i).id == id)
						routine = routinesList.item(i);
				}
			}
			return routine;
		}
//---------------------------------------------------------------
//---------------------------------------------------------------
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

	}
]);