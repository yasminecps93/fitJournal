var measurementsWidgetModule = angular.module('MeasurementsWidget');

measurementsWidgetModule.factory('MeasurementsWidgetService', ['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var bodyPartMeasurementArray;
		var measurementItemArray;
		var specificEntryArray;
		return{
			initDB:initDB,
			getAllBodyPartMeasurements:getAllBodyPartMeasurements,
			updateEntry:updateEntry,
			updateBodyPartName:updateBodyPartName,
			addNewEntry:addNewEntry,
			deleteBodyPartMeasurements:deleteBodyPartMeasurements,
		    getFilteredEntriesForArray:getFilteredEntriesForArray,
		    getSpecificEntry:getSpecificEntry
		}

		function initDB(){
			$ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			  }
			  catch(e) { 
			  	console.log("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS bodypart_list (id integer primary key autoincrement, created_at date, bodypart_name string, measurement double, unit string)";

			  try{
			  	runQuery(query,[],function(res) {
			      console.log("table created bodypart_list");
			   }, function (err) {
			      console.log("table bodypart_list error "+err);
			   }); 

			  }catch(e){
			  	console.log(e.message);
			  }

		  }.bind(this));
		}

		function getAllBodyPartMeasurements(){
			try{
				var deferred = $q.defer();
				var query = "SELECT id, bodypart_name, created_at, measurement, unit from bodypart_list list WHERE created_at=(SELECT MAX(created_at) from bodypart_list WHERE list.bodypart_name = bodypart_list.bodypart_name) ORDER BY created_at DESC";

				runQuery(query,[],function(response){
					//Success Callback
					console.log(response);
					bodyPartMeasurementArray = response.rows;
					deferred.resolve(response);
				},function(error){
					console.log("Error in get all bodyPart");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in getAllBodyPartTable "+e.message);
			}
		}


		function updateEntry(measurement,unit,id){
			var deferred = $q.defer();
			var query = "UPDATE bodypart_list SET measurement = ?, unit = ? WHERE id = ?";
			try{
				runQuery(query,[measurement,unit,id],function(response){
		
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log("Error in updating entry");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				console.log("Error in update entry "+e.message);
			}
		}

		function updateBodyPartName(newName, oldName){
			var deferred = $q.defer();
			var query = "UPDATE bodypart_list SET bodypart_name = ? WHERE bodypart_name = ?";
			try{
				runQuery(query,[newName, oldName],function(response){
		
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log("Error in updating name");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				console.log("Error in update body part name "+e.message);
			}
		}


		function addNewEntry(bodypart_name, measurement, unit){
			try{
				var deferred = $q.defer();
				var query = "INSERT INTO bodypart_list (created_at, bodypart_name, measurement, unit) VALUES (date('now','localtime'),?,?,?)";
				runQuery(query,[bodypart_name, measurement, unit],function(response){
					//Success Callback
					console.log(response);
					deferred.resolve(response);
				},function(error){
					console.log("Error in add new entry");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in addNewEntryTable "+e.message);

			}
		}

		function deleteBodyPartMeasurements(bodypart_name){
			try{
				var deferred = $q.defer();
				var query = "DELETE FROM bodypart_list WHERE bodypart_name = ?";
				runQuery(query,[bodypart_name],function(response){
					//Success Callback
					console.log(response);
					deferred.resolve(response);
				},function(error){
					console.log("Error in deleting bodyPart");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in deleteBodyPartTable "+e.message);
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

//---------------------------------------------------------------------//
//-----------------------------FOR CHART-------------------------------//
//---------------------------------------------------------------------//
		function getFilteredEntriesForArray(){

			var deferred = $q.defer();
			var query = "SELECT DISTINCT bodypart_name from bodypart_list";
			try{
				runQuery(query,[],function(response){
				//Success Callback
				console.log(response);
				measurementItemArray = response.rows;
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in getFilteredEntriesForArray "+e.message);
			}
		}

		function getSpecificEntry(bodypart_name){

			var deferred = $q.defer();
			var query = "SELECT * from bodypart_list WHERE bodypart_name = ?";
			try{
				runQuery(query,[bodypart_name],function(response){
				//Success Callback
				console.log(response);
				specificEntryArray = response.rows;
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in getFilteredEntriesForArray "+e.message);
			}
		}

}]);