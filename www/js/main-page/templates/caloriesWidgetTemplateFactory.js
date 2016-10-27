var caloriesWidgetModule = angular.module('CaloriesWidget');

caloriesWidgetModule.factory('CaloriesWidgetService',['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var caloriesArray;

		return{
			initDB:initDB,
			getAllCalories:getAllCalories,
			getLastEntry:getLastEntry,
			addNewRow:addNewRow,
			updateCalories:updateCalories
		}

		function initDB(){
			$ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			  }
			  catch(e) { 
			  	alert("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS calories_list (id integer primary key autoincrement, created_at date, calories_in double, calories_out double, calories_total double)";

			  try{
			  	runQuery(query,[],function(res) {
			      console.log("table created calories_list");
			   }, function (err) {
			      console.log("table calories_list error "+err);
			   }); 

			  }catch(e){
			  	alert(e.message);
			  }

		  }.bind(this));
		}

		function getAllCalories(){
			try{
				var deferred = $q.defer();
		 		var query = "SELECT * from calories_list";
				runQuery(query,[],function(response){
					//Success Callback
					console.log(response);
					caloriesArray = response.rows;
					deferred.resolve(response);
				},function(error){
					alert("Error in get all calories");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in getAllCaloriesTable "+e.message);
			}
		
		}

		function getLastEntry(){
			try{
				var deferred = $q.defer();
		 		var query = "SELECT * from calories_list WHERE id=(SELECT MAX(id) from calories_list)";
				runQuery(query,[],function(response){
					//Success Callback
					console.log(response);
					caloriesArray = response.rows;
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

		function addNewRow(calories_in, calories_out, calories_total){
			try{
				var deferred = $q.defer();
				var query = "INSERT INTO calories_list (created_at, calories_in, calories_out, calories_total) VALUES (date('now','localtime'),?,?,?)";
				runQuery(query,[calories_in, calories_out, calories_total],function(response){
					//Success Callback
					console.log(response);
					deferred.resolve(response);
				},function(error){
					alert("Error in add new row");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in addNewRowTable "+e.message);

			}
		}

		function updateCalories(calories_in, calories_out, calories_total, id){
			var deferred = $q.defer();
			var query = "UPDATE calories_list SET calories_in = ?, calories_out = ?, calories_total = ? WHERE id = ?";
			try{
				runQuery(query,[calories_in, calories_out, calories_total, id],function(response){
		
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					alert("Error in updating calories");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				alert("Error in update calories "+e.message);
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