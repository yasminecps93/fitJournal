var routinesListModule = angular.module('RoutinesList',['ngCordova']);

routinesListModule.controller('RoutinesListCtrl',['$scope','$cordovaSQLite','$ionicPlatform','RoutinesService','$ionicPopup',
	function($scope,$cordovaSQLite,$ionicPlatform,RoutinesService, $ionicPopup){

		initData();
		initMethods();

		function initData(){
			$scope.newRoutine = { //ng-model
				name: ''
			};
			$scope.loadingRoutines = false; //for loader icon
			$scope.shouldShowDelete = false; //toggle for delete buttons
			$scope.editButtonLabel = "Edit"; //text for the toggle
			RoutinesService.initDB(); //start database and create table
			fetchRoutines(); //get previous routines
		}

		function initMethods() {
			$scope.addNewRoutine = addNewRoutine;
			$scope.toggleEdit = toggleEdit;
			$scope.deleteRoutine = deleteRoutine;
		}

		function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}


//------------------------------------------------------------------------//
//--------------------------------POPUP-----------------------------------//
//------------------------------------------------------------------------//

		$scope.showPopup = function()
		{
			console.log("opened popup");
  			$scope.data={}
  			var entrypopup = $ionicPopup.show
  			({
  				templateUrl:'add-routine-popup.html',
  				title: 'Enter routine name',
  				scope: $scope,
  				buttons:
  				[
	  				{
	  					text: 'Cancel', onTap:
	  					function(e){ return true;}
	  				},{
	  					text:'Save',
	  					type:'button-positive',
	  					onTap:function(e){
	  						addNewRoutine();
	  					}
	  				}
  				]
  			});
  			$scope.closePopup = function(){
	  			entrypopup.close();
	  		}
  		}

  		 $scope.showConfirm = function(index,id) {
			   var confirmPopup = $ionicPopup.confirm({
			     title: 'Alert',
			     template: 'Are you sure you want to delete this item?'
			   });

			   confirmPopup.then(function(res) {
			     if(res) {
			       deleteRoutine(index,id);
			     } else {
			       console.log('You are not sure');
			     }
			   });
		};

//------------------------------------------------------------------------//
//-------------------------ROUTINE FUNCTIONS------------------------------//
//------------------------------------------------------------------------//
		function fetchRoutines() {
			$scope.loadingRoutines = true; //show loader
			RoutinesService.getAllRoutines()
			.then(fetchRoutineListSuccessCB,fetchRoutineListErrorCB);
		}

		//if fetchRoutines() is success
		function fetchRoutineListSuccessCB(response)
		{
			$scope.loadingRoutines = false; //hide loader
			if(response && response.rows && response.rows.length > 0)
			{
				$scope.routinesList = [];
				for(var i=0;i<response.rows.length;i++)
				{
					$scope.routinesList.push({ //add items from database response to array
						id:response.rows.item(i).id,
						name:response.rows.item(i).name
					});
				}
			}else
			{
				console.log("No routines created till now.");
				$scope.routinesList = []; //clear array
			}
		}

		//if fetchRoutines() is error
		function fetchRoutineListErrorCB(error)
		{
			$scope.loadingRoutines = false; //hide loader
			console.log("Some error occurred in fetching Routines List");
		}


		function addNewRoutine()
		{
			if($scope.newRoutine.name != '' && $scope.newRoutine.name.length > 0){

				RoutinesService.addNewRoutine($scope.newRoutine.name)
				.then(function(response)
				{
					$scope.newRoutine.name = ''; //clear input field
					alert("Saved");
					fetchRoutines(); //fetch new data
				},function(error){
					console.log("Error in adding new routine");
				});
			}else
			{
				console.log('Please enter the name of the routine.');
			}
		}

		function deleteRoutine(index,id) //index in array, id of item in database
		{
			if(index > -1)
			{
				RoutinesService.deleteRoutine(id)
				.then(function(response){
					$scope.routinesList.splice(index,1); //remove the item with this index and 
														 //	remove the empty row
				},function(error){
					console.log("Error in adding new routine");
				});
			}
		}
}]);
