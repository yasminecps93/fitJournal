var routineDetailsModule = angular.module('RoutineDetails');

routineDetailsModule.factory('RoutineService',['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		
		return {
			initDB:initDB,
			getAllEntries: getAllEntries,
			addNewEntry: addNewEntry,
			deleteEntry: deleteEntry
		}

		function initDB() {
		  $ionicPlatform.ready(function() {
		  	//   if(window.cordova)
		  	//   {
			  // 	db = $cordovaSQLite.openDB("myapp.db");
			  // }else
			  // {
			  // 	db = window.openDatabase("myapp.db", '1.0', 'Trackers DB', -1);
			  // }
			 
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			  //	alert("opened db");
			  }
			  catch(e) { 
			  	alert("Error in opening db" + e.message);
			  }
			
			   var query = "CREATE TABLE IF NOT EXISTS exercise_entries (id integer primary key autoincrement, routine_id integer , created_at datetime, exeName string, exeNumber double, exeUnit string, exeSet double, exeCal double)";
			    runQuery(query,[],function(res) {
			 //     alert("table created ");
			    }, function (err) {
			      console.log(err);
			       alert("error creating table ");
			    });
		  }.bind(this));
		}

		function getAllEntries(routineId){
			var deferred = $q.defer();
			var query = "SELECT * from exercise_entries WHERE routine_id = ?";
			runQuery(query,[routineId],function(response){
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

		function addNewEntry(routineId,exeName, exeNumber, exeUnit, exeSet, exeCal) {
			var deferred = $q.defer();
			var query = "INSERT INTO exercise_entries (routine_id, created_at, exeName, exeNumber, exeUnit, exeSet, exeCal) VALUES (?,datetime(),?,?,?,?,?)";
			runQuery(query,[routineId,exeName, exeNumber, exeUnit, exeSet, exeCal],function(response){
				//Success Callback
			//	alert("entry added successfully - "+exeUnit);
				console.log(response);
				deferred.resolve(response);
			},function(error){
				//Error Callback
				alert("error in entering")
				console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function deleteEntry(id) {
			var deferred = $q.defer();
			var query = "DELETE FROM exercise_entries WHERE id = ?";
			runQuery(query,[id],function(response){
				//Success Callback
			//	alert("deleteEntry Success");
				console.log(response);
				deferred.resolve(response);
			},function(error){
				//Error Callback
				alert("deleteEntry error");
				console.log(error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function runQuery(query,dataArray,successCb,errorCb)
		{
		  $ionicPlatform.ready(function() {		  
			    $cordovaSQLite.execute(db, query,dataArray).then(function(res) {
			//      alert("runQuery successfully");
			      successCb(res);
			    }, function (err) {
			    	alert("runQuery failed");
			      errorCb(err);
			    });
		  }.bind(this));
		}

	}
]);