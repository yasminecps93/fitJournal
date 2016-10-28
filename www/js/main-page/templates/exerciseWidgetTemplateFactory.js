var exerciseWidgetModule = angular.module('ExerciseWidget');

exerciseWidgetModule.factory('ExerciseWidgetService', ['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var lastEntryArray;
		var exerciseLogArray;

		return{
			initDB:initDB,
			getLastEntry:getLastEntry,
			getAllExercises:getAllExercises,
			addNewExercises:addNewExercises,
			deleteExercises:deleteExercises
		}

		function initDB(){
			$ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			  }
			  catch(e) { 
			  	alert("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS exerciselog_list (id integer primary key autoincrement, created_at date, exercise_name string, reps double, unit string, sets double, calOut double)";

			  try{
			  	runQuery(query,[],function(res) {
			      console.log("table created exerciselog_list");
			   }, function (err) {
			      console.log("table exerciselog_list error "+err);
			   }); 

			  }catch(e){
			  	alert(e.message);
			  }

		  }.bind(this));
		}

		function getLastEntry(){
			try{
				var deferred = $q.defer();
		 		var query = "SELECT * from exerciselog_list WHERE id=(SELECT MAX(id) from exerciselog_list)";
				runQuery(query,[],function(response){
					//Success Callback
					console.log(response);
					lastEntryArray = response.rows;
					deferred.resolve(response);
				},function(error){
					alert("Error in get last entry");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in getLastEntryTable "+e.message);
			}
		}

		function getAllExercises(created_at){
			try{
				var deferred = $q.defer();
				var query = "SELECT * from exerciselog_list WHERE created_at = ?";
				runQuery(query,[created_at],function(response){
					//Success Callback
					console.log(response);
					exerciseLogArray = response.rows;
					deferred.resolve(response);
				},function(error){
					alert("Error in get all exercises");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in getAllExercisesTable "+e.message);
			}
		}

		function addNewExercises(exercise_name, reps, unit, sets, calOut){
			try{
				var deferred = $q.defer();
				var query = "INSERT INTO exerciselog_list (created_at, exercise_name, reps, unit, sets, calOut) VALUES (date('now','localtime'),?,?,?,?,?)";
				runQuery(query,[exercise_name, reps, unit, sets, calOut],function(response){
					//Success Callback
					console.log(response);
					deferred.resolve(response);
				},function(error){
					alert("Error in add new entry");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in addNewExerciseTable "+e.message);
			}
		}

		function deleteExercises(created_at){
			try{
				var deferred = $q.defer();
				var query = "DELETE FROM exerciselog_list WHERE created_at = ?";
				runQuery(query,[created_at],function(response){
					//Success Callback
					console.log(response);
					deferred.resolve(response);
				},function(error){
					alert("Error in deleting exercise");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in deleteExerciseTable "+e.message);
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
			//      alert("success in runQuery function "+res);
			    }, function (err) {
			      errorCb(err);
			      alert("error in runQuery function "+err);
			    });

		  }.bind(this));
		}

}]);