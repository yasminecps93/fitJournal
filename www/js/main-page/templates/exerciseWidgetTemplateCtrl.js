var exerciseWidgetModule = angular.module('ExerciseWidget',['ngCordova','ionic']);

exerciseWidgetModule.controller('ExerciseWidgetCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','ExerciseWidgetService','RoutinesService','RoutineService','CaloriesWidgetService','$ionicModal','$ionicPopup','$rootScope',
	function($scope,$state,$cordovaSQLite,$ionicPlatform, ExerciseWidgetService, RoutinesService, RoutineService, CaloriesWidgetService, $ionicModal,$ionicPopup, $rootScope){
    
	    initData();
	    initMethods();

	    function initData(){
	    	$scope.cDate = "";
	    	$scope.calories = {
	    		inCal : 0,
	    		outCal : 0,
	    		totalCalories : 0
	    	}
	    	$scope.exercise = {
	    		name : "",
	    		reps : 0,
	    		unit : "",
	    		sets : 0,
	    		calOut : 0
	    	}
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
	    	$scope.dateExist = false;
			$scope.isFirstTime = true;

	    	$scope.lastEntryArray = [];
			$scope.exerciseLogArray = [];

			$scope.shouldShowDelete = false;
			$scope.editButtonLabel = "Edit";

			CaloriesWidgetService.initDB();
			ExerciseWidgetService.initDB();
			RoutineService.initDB();
			RoutinesService.initDB();
			currentDate();
			fetchRoutines();
	    }

	    function initMethods(){
	    	$scope.toggleEdit = toggleEdit;
	    }

	    function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}

//---------------------------------------------------------------------------------//
//---------------------------MODAL FUNCTIONS---------------------------------------//
//---------------------------------------------------------------------------------//

    $ionicModal.fromTemplateUrl('add-exercise-modal.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
    });


    $scope.openModal = function(){   
        $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function(){
      $scope.modal.remove();
    });

//---------------------------------------------------------------------------------//
//---------------------------POPUP FUNCTIONS---------------------------------------//
//---------------------------------------------------------------------------------//


    $scope.showChooseRoutinePopup = function(){
        $scope.data={}
        var routinepopup = $ionicPopup.show({
          templateUrl:'choose-routine-popup.html',
          title: 'Choose a routine or click next',
          scope: $scope,
          buttons:[
          {
            text: 'Cancel', onTap:
            function(e){ return true;}
          },{
            text:'Next',
            type:'button-positive',
            onTap:function(e){
           	//add loading entries
              $cope.openModal();
            }
          }
          ]
        }).then(function(res){
          //success

          console.log("Success");
        },function(err){
          //error
          console.log("Error");
        });
      }

      $scope.closeChooseRoutinePopup = function(){
        routinepopup.close();
      }

      $scope.showEntryPopup = function(){
        $scope.data={}
        var entrypopup = $ionicPopup.show({
          templateUrl:'add-entry-popup.html',
          title: 'Add new exercise',
          scope: $scope,
          buttons:[
          {
            text: 'Cancel', onTap:
            function(e){ return true;}
          },{
            text:'OK',
            type:'button-positive',
            onTap:function(e){
              addNewEntry();
            }
          }
          ]
        }).then(function(res){
          //success

          console.log("Success");
        },function(err){
          //error
          console.log("Error");
        });
      }

      $scope.closeEntryPopup = function(){
        entrypopup.close();
      }

//---------------------------------------------------------------------------------//
//--------------------CHECK CURRENT DATE FUNCTIONS---------------------------------//
//---------------------------------------------------------------------------------//

     function currentDate(){
        var month = new Date().getMonth() + 1;
        $scope.cDate = new Date().getFullYear()+ "-"+ month + "-" + new Date().getDate(); 
     	getLastEntry();
      }

//---------------------------------------------------------------------------------//
//------------------------------ROUTINES FUNCTIONS---------------------------------//
//---------------------------------------------------------------------------------//
		function fetchRoutines(){
			RoutinesService.getAllRoutines()
			.then(fetchRoutineListSuccessCB,fetchRoutineListErrorCB);
		}

		function fetchRoutineListSuccessCB(response)
		{
			if(response && response.rows && response.rows.length > 0)
			{
				$scope.routinesList = [];
				for(var i=0;i<response.rows.length;i++)
				{
					$scope.routinesList.push({
						id:response.rows.item(i).id,
						name:response.rows.item(i).name
					});
				}
			}else
			{
				alert("No routines created till now.");
			}
		}

		function fetchRoutineListErrorCB(error)
		{
			alert("Some error occurred in fetching Routines List");
		}

		function getExercisesFromRoutine(id){
			RoutineService.getAllEntries(id)
			.then(fetchEntriesSuccessCB,fetchEntriesErrorCB);
		}

		function fetchEntriesSuccessCB(response)
		{
			if(response && response.rows && response.rows.length > 0)
			{
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
				alert("No entries created till now.");
			}
		}

		function fetchEntriesErrorCB(error)
		{
			alert("Some error occurred in fetching Routines List");
		}
//---------------------------------------------------------------------------------//
//------------------------------LAST ENTRY FUNCTIONS-------------------------------//
//---------------------------------------------------------------------------------//
		function getLastEntry(){
			ExerciseWidgetService.getLastEntry()
			.then(fetchLastSuccessCB,fetchLastErrorCB);
		}

		function fetchLastSuccessCB(response)
		{
			if(response && response.rows && response.rows.length > 0)
			{
				$scope.lastEntryArray = [];
				for(var i=0;i<response.rows.length;i++)
				{
					$scope.lastEntryArray.push({
						id:response.rows.item(i).id,
						created_at:response.rows.item(i).created_at,
						exeName:response.rows.item(i).exercise_name,
						exeNumber:response.rows.item(i).reps,
						exeUnit:response.rows.item(i).unit,
						exeSet:response.rows.item(i).sets,
						exeCal:response.rows.item(i).calOut
					});
				}
				if($scope.cDate==$scope.lastEntryArray[0].created_at){
					$scope.dateExist=true;
				}else{
					$scope.dateExist=false;
				}
			}else
			{
				alert("No entries created till now.");
			}
		}

		function fetchLastErrorCB(error)
		{
			alert("Some error occurred in fetching last entry");
		}

//---------------------------------------------------------------------------------//
//----------------------------EXERCISE LOG FUNCTIONS-------------------------------//
//---------------------------------------------------------------------------------//
		function getExerciseLog(){
			ExerciseWidgetService.getAllExercises($scope.cDate)
			.then(fetchLogSuccessCB,fetchLogErrorCB);
		}

		function fetchLogSuccessCB(response)
		{
			if(response && response.rows && response.rows.length > 0)
			{
				$scope.exerciseLogArray = [];
				for(var i=0;i<response.rows.length;i++)
				{
					$scope.exerciseLogArray.push({
						id:response.rows.item(i).id,
						created_at:response.rows.item(i).created_at,
						exeName:response.rows.item(i).exercise_name,
						exeNumber:response.rows.item(i).reps,
						exeUnit:response.rows.item(i).unit,
						exeSet:response.rows.item(i).sets,
						exeCal:response.rows.item(i).calOut
					});
				}
			}else
			{
				alert("No entries created till now.");
			}
		}

		function fetchLogErrorCB(error)
		{
			alert("Some error occurred in fetching log exercises");
		}

		function addSaveLog(){
			try{
				if($scope.dateExist==true){
					ExerciseWidgetService.deleteExercises($scope.cDate)
					.then(function(response){
						addNewLog();
					},function(error){

					})
				}else{
					addNewLog();
				}
			}catch(e){
				alert("Error in addDeleteLog controller "+e.message);
			}
		}

		function addNewLog(){
			try{
				if($scope.entriesList.length>0){
					for(var i=0; i<$scope.entriesList.length; i++){
						ExerciseWidgetService.addNewExercises($scope.entriesList[i].exeName, $scope.entriesList[i].exeNumber, $scope.entriesList[i].exeUnit, $scope.entriesList[i].exeSet, $scope.entriesList[i].exeCal)
						.then(function(response){
							//Success
						},function(error){
							//Error
						});
					}
				}
				if($scope.exerciseLogArray.length>0){
					for(var j=0; j<$scope.exerciseLogArray.length; j++){
						ExerciseWidgetService.addNewExercises($scope.exerciseLogArray[j].exeName, $scope.exerciseLogArray[j].exeNumber, $scope.exerciseLogArray[j].exeUnit, $scope.exerciseLogArray[j].exeSet, $scope.exerciseLogArray[j].exeCal)
						.then(function(response){
							//Success
						},function(error){
							//Error
						});
					}
				}
			}catch(e){
				alert("Error in addNewLog controller "+e.message);
			}
		}

		function deleteEntrieListExercise(index){
			try{
				if(index>-1){
					$scope.entriesList.splice(index,1);
				}
			}catch(e){
				alert("Error in deleteEntrieListExercise controller");
			}

		}

		function deleteExerciseLogExercise(index){
			try{
				if(index>-1){
					$scope.exerciseLogArray.splice(index,1);
				}
			}catch(e){
				alert("Error in deleteExerciseLogExercise controller");
			}

		}

		function addNewExercise(){
			try{
				if($scope.exeName.name!='' && $scope.exeNumber.number>0 && $scope.exeSet.set>0){
					$scope.entriesList.push({
						id:$scope.entriesList[$scope.entriesList.length-1].id+1,
						created_at:$scope.cDate,
						exeName:$scope.exeName.name,
						exeNumber:$scope.exeNumber.number,
						exeUnit:$scope.exeUnit.name,
						exeSet:$scope.exeSet.set,
						exeCal:$scope.exeCal.value
					});
				}else{
					alert('Empty inputs!');
				}
			}catch(e){
				alert("Error in addNewExercise controller "+e.message);
			}	
		}

//---------------------------------------------------------------------------------//
//------------------------------CALORIES FUNCTIONS---------------------------------//
//---------------------------------------------------------------------------------//

}]);