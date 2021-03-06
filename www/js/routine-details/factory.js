var routineDetailsModule = angular.module('RoutineDetails');

routineDetailsModule.factory('RoutineService',['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		
		return {
			initDB:initDB,
			getAllEntries: getAllEntries,
			addNewEntry: addNewEntry,
			deleteEntry: deleteEntry,
			updateEntry:updateEntry
		}

		function initDB() {
		  $ionicPlatform.ready(function() {
			 
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			  //	console.log("opened db");
			  }
			  catch(e) { 
			  	console.log("Error in opening db" + e.message);
			  }
			
			   var query = "CREATE TABLE IF NOT EXISTS exercise_entries (id integer primary key autoincrement, routine_id integer , created_at date, exeName string, exeNumber double, exeUnit string, exeSet double, exeCal double)";
			    runQuery(query,[],function(res) {
			 //     console.log("table created ");
			    }, function (err) {
			      console.log(err);
			       console.log("error creating table ");
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
			var query = "INSERT INTO exercise_entries (routine_id, created_at, exeName, exeNumber, exeUnit, exeSet, exeCal) VALUES (?,date('now','localtime'),?,?,?,?,?)";
			runQuery(query,[routineId,exeName, exeNumber, exeUnit, exeSet, exeCal],function(response){
				//Success Callback
			
				console.log(response);
				deferred.resolve(response);
			},function(error){
				//Error Callback
				console.log("error in entering "+error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function deleteEntry(id) {
			var deferred = $q.defer();
			var query = "DELETE FROM exercise_entries WHERE id = ?";
			runQuery(query,[id],function(response){
				//Success Callback
			
				console.log(response);
				deferred.resolve(response);
			},function(error){
				//Error Callback
				console.log("deleteEntry error "+error);
				deferred.reject(error);
			});

			return deferred.promise;
		}

		function updateEntry(exeName, exeNumber, exeUnit, exeSet, exeCal, id){
			var deferred = $q.defer();
			var query = "UPDATE exercise_entries SET exeName = ?, exeNumber = ?, exeUnit = ?, exeSet = ?, exeCal = ? WHERE id = ?";
			try{
				runQuery(query,[exeName, exeNumber, exeUnit, exeSet, exeCal, id],function(response){
				//Success Callback
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log("Error in changing entry "+error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				console.log("Error in updateEntry "+e.message);
			}
		}

		function runQuery(query,dataArray,successCb,errorCb)
		{
		  $ionicPlatform.ready(function() {		  
			    $cordovaSQLite.execute(db, query,dataArray).then(function(res) {
			//      console.log("runQuery successfully");
			      successCb(res);
			    }, function (err) {
			    	console.log("runQuery failed");
			      errorCb(err);
			    });
		  }.bind(this));
		}

	}
]);