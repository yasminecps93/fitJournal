var weightWidgetModule = angular.module('WeightWidget');

weightWidgetModule.factory('WeightWidgetService', ['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var weightArray;
		return{
			initDB:initDB,
			getAllWeight:getAllWeight,
			addNewWeight:addNewWeight,
			updateWeight:updateWeight
		}

		function initDB(){
			$ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			//  	console.log("opened db ");
			  }
			  catch(e) { 
			  	console.log("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS weight_list (id integer primary key autoincrement, created_at date, current_date string, current_weight double, weight_unit string)";

			  try{
			  	runQuery(query,[],function(res) {
			      console.log("table created ");
			      console.log("table created for widget");
			   }, function (err) {
			      console.log(err);
			      console.log("error creating table "+err);
			   }); 
			  }catch(e){
			  	console.log(e.message);
			  }

		  }.bind(this));
		}

		function getAllWeight(){
			var deferred = $q.defer();
			var query = "SELECT * from weight_list";
			try{
				runQuery(query,[],function(response){
				//Success Callback
				console.log(response);
				weightArray = response.rows;
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in getAllWeight "+e.message);
			}
		}

		function updateWeight(current_weight,id){
			var deferred = $q.defer();
			var query = "UPDATE weight_list SET current_weight = ? WHERE id = ?";
			try{
				runQuery(query,[current_weight,id],function(response){
				//Success Callback
			//	console.log("New weight has been added. "+today_weight+", "+ weight_unit);
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log("Error in changing weight");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				console.log("Error in insertWeightTable "+e.message);
			}
		}

		function addNewWeight(current_date, current_weight, weight_unit){
			
			var deferred = $q.defer();
			var query = "INSERT INTO weight_list (created_at, current_date, current_weight, weight_unit) VALUES (date('now','localtime'),?,?,?)";
			try{
				runQuery(query,[current_date, current_weight, weight_unit],function(response){
				//Success Callback
			//	console.log("New weight has been added. "+today_weight+", "+ weight_unit);
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log("Error in adding weight");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				console.log("Error in insertWeightTable "+e.message);
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