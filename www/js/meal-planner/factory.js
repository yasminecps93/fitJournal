var mealPlannerModule = angular.module('MealPlanner');

mealPlannerModule.factory('MealsService',['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var mealPlannerList;
		return {
			initDB:initDB,
			getAllMealPlanner: getAllMealPlanner,
			addNewMealPlanner: addNewMealPlanner,
			getMealPlanner:getMealPlanner
		//	deleteAllFromTable: deleteAllFromTable
		}

		function initDB() {
		  $ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			  	alert("opened db ");
			  }
			  catch(e) { 
			  	alert("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS mealPlanner_list_try (id integer primary key autoincrement, created_at datetime, dateName string, no_of_entries integer)";
			  runQuery(query,[],function(res) {
			      console.log("table created ");
			      alert("table created ");
			   }, function (err) {
			      console.log(err);
			      alert("error creating table "+err);
			   }); 
			   
		  }.bind(this));
		}

		function getAllMealPlanner(){

			var deferred = $q.defer();
			var query = "SELECT * from mealPlanner_list_try";
			try{
				runQuery(query,[],function(response){
				//Success Callback
				console.log(response);
				mealPlannerList = response.rows;
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in getAllMealPlanner "+e.message);
			}
			
		}

		function addNewMealPlanner(dateName) {
			//console.log('adding new routine :'+name);
			var deferred = $q.defer();
			var query = "INSERT INTO mealPlanner_list_try (created_at, dateName, no_of_entries) VALUES (datetime(),?,?)";
			try{
				runQuery(query,[dateName,0],function(response){
				//Success Callback
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in ddNewMealPlanner "+e.message);
			}
			
		}

		function getMealPlanner(id) {
			try{
				var mealPlanner;
				if(mealPlannerList){
					for(var i=0;i<mealPlannerList.length;i++)
					{
						if(mealPlannerList.item(i).id == id)
							mealPlanner = mealPlannerList.item(i);
					}
				}
				return mealPlanner;
			}catch(e){
				alert("Error in getMealPlanner "+e.message);
			}
			
		}

		function deleteAllFromTable(){
			var deferred = $q.defer();
			
			try{
				var query = "DELETE from mealPlanner_list_try";
				runQuery(query,[],function(response){
				//Success Callback
				alert("deleted");
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					alert("Error in runQuery delete");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;

			}catch(e){
				alert("Cannot delete "+e.message);
			}
		}

		function runQuery(query,dataArray,successCb,errorCb)
		{
		  $ionicPlatform.ready(function() {	
		
		  		$cordovaSQLite.execute(db, query, dataArray).then(function(res) {
			      successCb(res);
			      alert("success in runQuery function "+res);
			    }, function (err) {
			      errorCb(err);
			      alert("error in runQuery function "+err);
			    });

		  }.bind(this));
		}

	}
]);