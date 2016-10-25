var profileDetailsModule = angular.module('ProfileDetails');

profileDetailsModule.factory('ProfileService',['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var ProfileDataList;

		return{
			initDB:initDB,
			getAllProfileData: getAllProfileData,
			addNewProfileData: addNewProfileData,
			deleteEntry: deleteEntry,
			getProfileData:getProfileData,
			addNewWeight: addNewWeight
		}

		function initDB() {
		  $ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			//  	alert("opened db ");
			  }
			  catch(e) { 
			  	alert("Error in opening db " + e.message);
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS profiledata_list (id integer primary key autoincrement, current_weight double, weight_unit string, goal_weight double, goal_date string, total_weight_loss double, weekly_weight_loss double)";
			  var query_weight = "CREATE TABLE IF NOT EXISTS weight_list (id integer primary key autoincrement, created_at datetime, current_date string, today_weight double, weight_unit string)";
			  try{
				  	runQuery(query,[],function(res) {
				      console.log("table created ");
				 //     alert("table created ");
				   }, function (err) {
				      console.log(err);
				      alert("error creating table "+err);
				   }); 
			   
			  }catch(e){
			  	alert("Error creating table"+e.message);
			  }

			  try{
				  	runQuery(query_weight,[],function(res) {
				      console.log("table created");
				//      alert("table created for query_weight");
				   }, function (err) {
				      console.log(err);
				      alert("error creating table for query_weight"+err);
				   }); 
			   
			  }catch(e){
			  	alert("Error creating table for query_weight"+e.message);
			  }
			  
		  }.bind(this));
		}

		function addNewWeight(current_date, today_weight, weight_unit){
			
			var deferred = $q.defer();
			var query = "INSERT INTO weight_list (created_at, current_date, today_weight, weight_unit) VALUES (datetime(),?,?,?)";
			try{
				runQuery(query,[current_date,today_weight, weight_unit],function(response){
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

		function getAllProfileData(){

			var deferred = $q.defer();
			var query = "SELECT * from profiledata_list";
		//	var query = "SELECT last_insert_rowid()";
			try{
				runQuery(query,[],function(response){
				//Success Callback
				//alert(response);
				ProfileDataList = response.rows;
				deferred.resolve(response);
			//	alert("last insert rowid() "+response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
			  	alert("Error in getAllProfileData "+e.message);
			}
			
			
		}

		function addNewProfileData(current_weight, weight_unit, goal_weight, goal_date, total_weight_loss, weekly_weight_loss) {
		//	console.log('adding new routine :'+name);
			var deferred = $q.defer();
			var query = "INSERT INTO profiledata_list (current_weight, weight_unit, goal_weight, goal_date, total_weight_loss, weekly_weight_loss) VALUES (?,?,?,?,?,?)";
			try{
				runQuery(query,[current_weight, weight_unit, goal_weight, goal_date, total_weight_loss, weekly_weight_loss],function(response){
				//Success Callback
			//	alert(current_weight+", "+weight_unit+", "+goal_weight+", "+goal_date+", "+total_weight_loss+", "+weekly_weight_loss);
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				alert("Error in addNewProfileData "+e.message);
			}
			
		}

		function getProfileData(id) {
			var profiledata;
			try{
				if(ProfileDataList){
					for(var i=0;i<ProfileDataList.length;i++)
					{
						if(ProfileDataList.item(i).id == id)
							profiledata = ProfileDataList.item(i);
					}
				}
				return profiledata;
			}catch(e){
				alert("Error in getProfileData "+e.message);
			}
				
		}

		function deleteEntry() {
			try{
				var deferred = $q.defer();
				var query = "DELETE * FROM profiledata_list";
				runQuery(query,[],function(response){
					//Success Callback
			//		alert("deleteEntry Success");
					console.log(response);
					deferred.resolve(response);
				},function(error){
					//Error Callback
					alert("deleteEntry error");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in deleteEntry "+e.message);
			}
			
		}

		function runQuery(query,dataArray,successCb,errorCb)
		{
		  $ionicPlatform.ready(function() {	
		
		  		$cordovaSQLite.execute(db, query, dataArray).then(function(res) {
			      successCb(res);
			  //    alert("success in runQuery function "+res);
			    }, function (err) {
			      errorCb(err);
			      alert("error in runQuery function "+err);
			    });

		  }.bind(this));
		}

	}]);