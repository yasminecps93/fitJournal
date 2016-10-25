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
			//  	alert("opened db ");
			  }
			  catch(e) { 
			  	alert("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS weight_list (id integer primary key autoincrement, created_at datetime, current_date string, current_weight double, weight_unit string)";

			  try{
			  	runQuery(query,[],function(res) {
			      console.log("table created ");
			      alert("table created for widget");
			   }, function (err) {
			      console.log(err);
			      alert("error creating table "+err);
			   }); 
			  }catch(e){
			  	alert(e.message);
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
				alert("Error in getAllWeight "+e.message);
			}
		}

		function updateWeight(current_weight,id){
			var deferred = $q.defer();
			var query = "UPDATE weight_list SET current_weight = ? WHERE id = ?";
			try{
				runQuery(query,[current_weight,id],function(response){
				//Success Callback
			//	alert("New weight has been added. "+today_weight+", "+ weight_unit);
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					alert("Error in changing weight");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				alert("Error in insertWeightTable "+e.message);
			}
		}

		function addNewWeight(current_date, current_weight, weight_unit){
			
			var deferred = $q.defer();
			var query = "INSERT INTO weight_list (created_at, current_date, current_weight, weight_unit) VALUES (datetime(),?,?,?)";
			try{
				runQuery(query,[current_date, current_weight, weight_unit],function(response){
				//Success Callback
			//	alert("New weight has been added. "+today_weight+", "+ weight_unit);
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					alert("Error in adding weight");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				alert("Error in insertWeightTable "+e.message);
			}
		}

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