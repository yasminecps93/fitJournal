var cameraWidgetModule = angular.module('CameraWidget');

cameraWidgetModule.factory('CameraWidgetService', ['$cordovaSQLite','$ionicPlatform','$q',
	function($cordovaSQLite,$ionicPlatform,$q){
		var db;
		var imageArray;

		return{
			initDB:initDB,
			getAllEntry:getAllEntry,
			addNewImage:addNewImage,
			updateEntry:updateEntry
		}

		function initDB(){
			$ionicPlatform.ready(function() {
		  
			  try{
			  	db = $cordovaSQLite.openDB({name:"myapp.db", location:1});
			  }
			  catch(e) { 
			  	console.log("Error in opening db");
			  }
			
			  var query = "CREATE TABLE IF NOT EXISTS image_list (id integer primary key autoincrement, created_at date, widget_id integer, image_file string, caption string)";

			  try{
			  	runQuery(query,[],function(res) {
			      console.log("table created image_list");
			   }, function (err) {
			      console.log("table image_list error "+err);
			   }); 

			  }catch(e){
			  	console.log(e.message);
			  }

		  }.bind(this));
		}

		function getAllEntry(cDate){
			try{
				var deferred = $q.defer();
		 		var query = "SELECT * from image_list WHERE created_at = ?";
				runQuery(query,[cDate],function(response){
					//Success Callback
					console.log(response);
					imageArray = response.rows;
					deferred.resolve(response);
				},function(error){
					console.log("Error in get last entry");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in getLastEntryTable "+e.message);
			}
		}

		function addNewImage(widget_id, image_file, caption){
			try{
				var deferred = $q.defer();
				var query = "INSERT INTO image_list (created_at, widget_id, image_file, caption) VALUES (date('now','localtime'),?,?,?)";
				runQuery(query,[widget_id, image_file, caption],function(response){
					//Success Callback
					console.log(response);
					deferred.resolve(response);
				},function(error){
					console.log("Error in add new row");
					console.log(error);
					deferred.reject(error);
				});

				return deferred.promise;
			}catch(e){
				console.log("Error in addNewImageTable "+e.message);

			}
		}

		function updateEntry(image_file, caption,id){
			var deferred = $q.defer();
			var query = "UPDATE image_list SET image_file = ?, caption = ? WHERE id = ?";
			try{
				runQuery(query,[image_file, caption, id],function(response){
		
				console.log(response);
				deferred.resolve(response);
				},function(error){
					//Error Callback
					console.log("Error in updating image");
					console.log(error);
					deferred.reject(error);
				});
				return deferred.promise;
			}catch(e){
				console.log("Error in update image "+e.message);
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