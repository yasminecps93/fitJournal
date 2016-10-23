var mainPageModule = angular.module('MainPage');

mainPageModule.factory('MainService', ['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var widgetList;
		return{
			initDB:initDB,
			getAllWidget:getAllWidget,
			addNewWidget:addNewWidget,
			deleteWidget:deleteWidget,
			deleteTable:deleteTable
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
			
			  var query = "CREATE TABLE IF NOT EXISTS widget_list_try1 (id integer primary key autoincrement, title string, row integer, col integer, sizeX integer, sizeY integer, directives string)";

			  try{
			  	runQuery(query,[],function(res) {
			      console.log("table created ");
			//      alert("table created for widget");
			   }, function (err) {
			      console.log(err);
			      alert("error creating table "+err);
			   }); 
			  }catch(e){
			  	alert(e.message);
			  }

		  }.bind(this));
		}

		function getAllWidget(){
			var deferred = $q.defer();
			var query = "SELECT * from widget_list_try1";
			try{
				runQuery(query,[],function(response){
				//Success Callback
				console.log(response);
				widgetList = response.rows;
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in getAllWidget "+e.message);
			}
			
		}

		function addNewWidget(title,row,col,sizeX, sizeY, directives){
			var deferred = $q.defer();
			var query = "INSERT INTO widget_list_try1 (title, row, col, sizeX, sizeY, directives) VALUES (?,?,?,?,?,?)";
			try{
				runQuery(query,[title,row,col,sizeX,sizeY,directives],function(response){
				//Success Callback
			//	alert("directives "+directives);
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in addNewWidget "+e.message);
			}
		}

		function deleteWidget(id){
			var deferred = $q.defer();
			try{
				var query = "DELETE FROM widget_list_try1 WHERE id = ?";
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
			}catch(e){
				alert("Error in deleteWidget "+e.message);
			}
			
		}

		function deleteTable(){
			var deferred = $q.defer();
			try{
				var query = "DELETE from widget_list_try1";
				runQuery(query,[],function(response){
					//Success Callback
				//	alert("Table dropped");
					alterTable();
					console.log(response);
					deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in deleteTable "+e.message);
			}
			
		}

		function alterTable(){
			var deferred = $q.defer();
			try{
				var query = "DELETE from sqlite_sequence where name='widget_list_try1'";
				runQuery(query,[],function(response){
					//Success Callback
				//	alert("Table dropped");
					console.log(response);
					deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				alert("Error in alterTable "+e.message);
			}
			
		}

		function runQuery(query,dataArray,successCb,errorCb)
		{
		  $ionicPlatform.ready(function() {	
		
		  		$cordovaSQLite.execute(db, query, dataArray).then(function(res) {
			      successCb(res);
			 //     alert("success in runQuery function "+res);
			    }, function (err) {
			      errorCb(err);
			      alert("error in runQuery function "+err);
			    });

		  }.bind(this));
		}
	}
]);