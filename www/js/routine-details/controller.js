var routineDetailsModule = angular.module('RoutineDetails',['ngCordova']);

routineDetailsModule.controller('RoutineDetailsCtrl',['$scope','$stateParams','$cordovaSQLite','$ionicPlatform','RoutineService','RoutinesService', '$ionicPopup',
	function($scope,$stateParams,$cordovaSQLite,$ionicPlatform,RoutineService,Routines,$ionicPopup){
		
		initData();
		initMethods();

		function initData(){
			
			$scope.units={
				option: [
				  {name: 'reps'},
				  {name: 'kilometers'},
				  {name: 'meters'},
				  {name: 'miles'},
				  {name: 'rounds'},
				  {name: 'laps'},
				  {name: 'feet'},
				  {name: 'hours'},
				  {name: 'minutes'},
				  {name: 'seconds'}
				  
				]
			};
			$scope.exeUnit = {
				name: 'reps'
			};
			$scope.exeName = {
				name: ''
			};
			$scope.exeNumber = {
				number: 0
			};
			$scope.exeSet = {
				set: 0
			};
			$scope.exeCal = {
				value: 0
			};

			$scope.loadingEntries = false; //hide loader
			$scope.shouldShowDelete = false; //hide delete button
			$scope.editButtonLabel = "Edit"; //text for toggle
			$scope.routineId = $stateParams['id'];  //get the id of the routine passed from the previous page
			$scope.routineInfo = Routines.getRoutine($scope.routineId); //get the exercises with that routine id from database
			RoutineService.initDB(); //start the db and create tables
			fetchEntries(); 
		}

		function initMethods() {
			$scope.addNewEntry = addNewEntry;
			$scope.toggleEdit = toggleEdit;
			$scope.deleteEntry = deleteEntry;
			$scope.editExercise = editExercise;
		}

		function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}

//---------------------------------------------------------------------------------------//
//--------------------------------POPUP FUNCTIONS----------------------------------------//
//---------------------------------------------------------------------------------------//
  		//for add new entry popup
  		$scope.showPopup = function(){
  			$scope.exeUnit = {
				name: 'reps'
			};
			$scope.exeName = {
				name: ''
			};
			$scope.exeNumber = {
				number: 0
			};
			$scope.exeSet = {
				set: 0
			};
			$scope.exeCal = {
				value: 0
			};
  			$scope.data={}
  			var entrypopup = $ionicPopup.show({
  				templateUrl:'add-exercise-popup.html',
  				title: 'Enter new entry',
  				scope: $scope,
  				buttons:[
  				{
  					text: 'Cancel', onTap:
  					function(e){ return true;}
  				},{
  					text:'Save',
  					type:'button-positive',
  					onTap:function(e){
  						addNewEntry();
  					}
  				}
  				]
  			});
  			$scope.closePopup = function(){
	  			entrypopup.close();
	  		}
  		}

  		//for update entry popup
  		$scope.showUpdatePopup = function(index){
      	if(index>-1){
      		for(var i=0; i<$scope.entriesList.length; i++){
	      			if($scope.entriesList[i].id==index){
	      				$scope.exeUnit = {
							name: $scope.entriesList[i].exeUnit
						};
						$scope.exeName = {
							name: $scope.entriesList[i].exeName
						};
						$scope.exeNumber = {
							number: $scope.entriesList[i].exeNumber
						};
						$scope.exeSet = {
							set: $scope.entriesList[i].exeSet
						};
						$scope.exeCal = {
							value: $scope.entriesList[i].exeCal
						};
					
      				}
      			
      			}
	      	}
	        $scope.data={}
	        var updatepopup = $ionicPopup.show({
	          templateUrl:'update-entry-popup.html',
	          title: 'Edit exercise',
	          scope: $scope,
	          buttons:[
	          {
	            text: 'Cancel', onTap:
	            function(e){ 
	            	return true;}
	          },{
	            text:'OK',
	            type:'button-positive',
	            onTap:function(e){
	              editExercise(index);
	            }
	          }
	          ]
	        });
			
			 $scope.closeEntryPopup = function(){
			    updatepopup.close();
			  }  
	      }

	      $scope.showConfirm = function(index,id) {
			   var confirmPopup = $ionicPopup.confirm({
			     title: 'Alert',
			     template: 'Are you sure you want to delete this item?'
			   });

			   confirmPopup.then(function(res) {
			     if(res) {
			       deleteEntry(index,id);
			     } else {
			       console.log('You are not sure');
			     }
			   });
			 };
//---------------------------------------------------------------------------------------//
//--------------------------------ENTRIES FUNCTIONS--------------------------------------//
//---------------------------------------------------------------------------------------//

		function fetchEntries() {
			$scope.loadingEntries = true;
			RoutineService.getAllEntries($scope.routineId)
			.then(fetchEntriesSuccessCB,fetchEntriesErrorCB);
		}

		function fetchEntriesSuccessCB(response)
		{
			$scope.loadingRoutines = false;
			if(response && response.rows && response.rows.length > 0)
			{
				console.log(response.rows.length)
				$scope.entriesList = [];

				for(var i=0;i<response.rows.length;i++)
				{
					$scope.entriesList.push({ //add to array from response given by db
						id:response.rows.item(i).id,
						created_at:response.rows.item(i).created_at,
						exeName:response.rows.item(i).exeName,
						exeNumber:response.rows.item(i).exeNumber,
						exeUnit:response.rows.item(i).exeUnit,
						exeSet:response.rows.item(i).exeSet,
						exeCal:response.rows.item(i).exeCal,
					});
				}
			}else
			{
				console.log("No entries created till now.");
				$scope.entriesList = []; //clear array
			}
		}

		function fetchEntriesErrorCB(error)
		{
			$scope.loadingRoutines = false;
			console.log("Some error occurred in fetching Routines List");
		}

		function addNewEntry()
		{
			try{
				if($scope.exeName.name!= '' && $scope.exeNumber.number!= ''&& $scope.exeSet.set!= ''){
				RoutineService.addNewEntry($scope.routineId,$scope.exeName.name,$scope.exeNumber.number,$scope.exeUnit.name,$scope.exeSet.set,$scope.exeCal.value)
				.then(function(response){
					alert("Saved");
					fetchEntries(); //refresh the array
				},function(error){
					console.log("Error in adding new entry");
				});
				}else
					{
						alert('Please enter a positive value.');
					}
			}catch(e){
				console.log("cannot enter addNewEntry function" + e.code +", "+e.message);
			}
			
		}

		function deleteEntry(index,id) //index of item in array and its id in the database
		{
			if(index > -1)
			{
				RoutineService.deleteEntry(id)
				.then(function(response){
					$scope.entriesList.splice(index,1);
				
				},function(error){
					console.log("Error in adding new entry");
				});
			}
		}

		function editExercise(index){
			try{
				
				if($scope.exeName.name!='' && $scope.exeNumber.number>0 && $scope.exeSet.set>0){
					RoutineService.updateEntry($scope.exeName.name, $scope.exeNumber.number, $scope.exeUnit.name, $scope.exeSet.set, $scope.exeCal.value, index)
					.then(function(response){
						fetchEntries();
					},function(error){
						console.log("Error in update entry");
					})				
				}else{
					alert('Empty inputs!');
				}
			}catch(e){
				console.log("Error in editExercise controller "+e.message);
			}	
		}
}]);
