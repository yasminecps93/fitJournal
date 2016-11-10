var mainPageModule = angular.module('MainPage');

mainPageModule.factory('MainService', ['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var widgetList;
		var themeList;
		return{
			initDB:initDB,
			getAllWidget:getAllWidget,
			addNewWidget:addNewWidget,
			deleteWidget:deleteWidget,
			deleteTable:deleteTable,
			getChosenTheme:getChosenTheme,
			addTheme:addTheme
		}

		function initDB(){
			$ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			  }
			  catch(e) { 
			  	alert("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS widget_list (id integer primary key autoincrement, title string, row integer, col integer, sizeX integer, sizeY integer, directives string)";
			  var theme_query = "CREATE TABLE IF NOT EXISTS theme_list (id integer primary key autoincrement, theme string)";
			  
			  try{
			  	runQuery(query,[],function(res) { //run query for widget_list
			      console.log("table created ");
			//      alert("table created for widget");
			   }, function (err) {
			      console.log(err);
			      console.log("error creating table "+err);
			   }); 
			  }catch(e){
			  	console.log(e.message);
			  }

			  try{
			  	runQuery(theme_query,[],function(res) { //run query for theme_list
			      console.log("table created ");
			//      alert("table created for widget");
			   }, function (err) {
			      console.log(err);
			      console.log("error creating table "+err);
			   }); 

			  }catch(e){
			  	console.log(e.message);
			  }

		  }.bind(this));
		}

//----------------------------------------------------------------------------------------//
//--------------------------------------THEMES--------------------------------------------//
//----------------------------------------------------------------------------------------//
		function getChosenTheme(){
			var deferred = $q.defer();
			var query = "SELECT * from theme_list WHERE id=(SELECT MAX(id) from theme_list)";
			try{
				runQuery(query,[],function(response){
				//Success Callback
				console.log(response);
				themeList = response.rows;
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in getAllWidget "+e.message);
			}
		}

		function addTheme(theme){
			var deferred = $q.defer();
			var query = "INSERT INTO theme_list (theme) VALUES (?)";
			try{
				runQuery(query,[theme],function(response){
				//Success Callback
			//	console.log("directives "+directives);
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in addTheme "+e.message);
			}
		}

//----------------------------------------------------------------------------------------//
//-------------------------------------WIDGETS--------------------------------------------//
//----------------------------------------------------------------------------------------//
		function getAllWidget(){
			var deferred = $q.defer();
			var query = "SELECT * from widget_list";
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
				console.log("Error in getAllWidget "+e.message);
			}
			
		}

		function addNewWidget(title,row,col,sizeX, sizeY, directives){
			var deferred = $q.defer();
			var query = "INSERT INTO widget_list (title, row, col, sizeX, sizeY, directives) VALUES (?,?,?,?,?,?)";
			try{
				runQuery(query,[title,row,col,sizeX,sizeY,directives],function(response){
				//Success Callback
			//	console.log("directives "+directives);
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in addNewWidget "+e.message);
			}
		}

		function deleteWidget(id){
			var deferred = $q.defer();
			try{
				var query = "DELETE FROM widget_list WHERE id = ?";
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
				console.log("Error in deleteWidget "+e.message);
			}
			
		}

		function deleteTable(){
			var deferred = $q.defer();
			try{
				var query = "DELETE from widget_list";
				runQuery(query,[],function(response){
					//Success Callback
				//	console.log("Table dropped");
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
				console.log("Error in deleteTable "+e.message);
			}
			
		}

		function alterTable(){ //clear id sequence and start over
			var deferred = $q.defer();
			try{
				var query = "DELETE from sqlite_sequence where name='widget_list'";
				runQuery(query,[],function(response){
					//Success Callback
				//	console.log("Table dropped");
					console.log(response);
					deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in alterTable "+e.message);
			}
			
		}

		function runQuery(query,dataArray,successCb,errorCb)
		{
		  $ionicPlatform.ready(function() {	
		
		  		$cordovaSQLite.execute(db, query, dataArray).then(function(res) {
			      successCb(res);
			 //     console.log("success in runQuery function "+res);
			    }, function (err) {
			      errorCb(err);
			      console.log("error in runQuery function "+err);
			    });

		  }.bind(this));
		}
	}
]);