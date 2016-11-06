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
				  {name: 'miles'},
				  {name: 'rounds'},
				  {name: 'seconds'},
				  {name: 'minutes'}
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

			$scope.loadingEntries = false;
			$scope.shouldShowDelete = false;
			$scope.editButtonLabel = "Edit";
			$scope.routineId = $stateParams['id'];
			$scope.routineInfo = Routines.getRoutine($scope.routineId);
			RoutineService.initDB();
			fetchEntries();
			console.log($scope.editButtonLabel);
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
//---------------------------------------------------------------------------------------//
//--------------------------------ENTRIES FUNCTIONS--------------------------------------//
//---------------------------------------------------------------------------------------//

		function fetchEntries() {
			$scope.loadingEntries = true;
			RoutineService.getAllEntries($scope.routineId)
			.then(fetchEntriesSuccessCB,fetchEntriesErrorCB);
		}

		function addNewEntry()
		{
			//try testing now
			try{
				if($scope.exeName.name!= '' && $scope.exeNumber.number!= ''&& $scope.exeSet.set!= ''){
				RoutineService.addNewEntry($scope.routineId,$scope.exeName.name,$scope.exeNumber.number,$scope.exeUnit.name,$scope.exeSet.set,$scope.exeCal.value)
				.then(function(response){
				//	$scope.newEntry.value = 0;
					alert("Saved");
					fetchEntries();
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

		function fetchEntriesSuccessCB(response)
		{
			$scope.loadingRoutines = false;
			if(response && response.rows && response.rows.length > 0)
			{
				console.log(response.rows.length)
				$scope.entriesList = [];

				for(var i=0;i<response.rows.length;i++)
				{
					$scope.entriesList.push({
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
				$scope.message = "No entries created till now.";
				$scope.entriesList = [];
			}
		}

		function fetchEntriesErrorCB(error)
		{
			$scope.loadingRoutines = false;
			$scope.message = "Some error occurred in fetching Routines List";
		}

		function deleteEntry(index,id)
		{
			if(index > -1)
			{
				RoutineService.deleteEntry(id)
				.then(function(response){
					$scope.entriesList.splice(index,1);
				//	console.log("Entry has been succesfully deleted.");
				},function(error){
					console.log("Error in adding new entry");
				});
			}
		}

		function editExercise(index){
			try{
				console.log("editExercise----"+index);
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
