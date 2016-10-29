var exerciseWidgetModule = angular.module('ExerciseWidget',['ngCordova','ionic']);

exerciseWidgetModule.controller('ExerciseWidgetCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','ExerciseWidgetService','RoutinesService','RoutineService','CaloriesWidgetService','$ionicModal','$ionicPopup','$rootScope',
	function($scope,$state,$cordovaSQLite,$ionicPlatform, ExerciseWidgetService, RoutinesService, RoutineService, CaloriesWidgetService, $ionicModal,$ionicPopup, $rootScope){
    
	    initData();
	    initMethods();

	    function initData(){
	    	$scope.cDate = "";
	    	$scope.totalCal = 0;
	    	$scope.tempIDCalories =0;
	    	$scope.tempIDRoutine = 0;
	    	$scope.calories = {
	    		inCal : 0,
	    		outCal : 0,
	    		totalCalories : 0
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
			$scope.choseRoutine = false;
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
	    	$scope.getExercisesFromRoutine = getExercisesFromRoutine;
	    	$scope.getLastEntry = getLastEntry;
	    	$scope.getExerciseLog = getExerciseLog;
	    	$scope.saveLog = saveLog;
	    	$scope.addNewLog = addNewLog;
	    	$scope.deleteExercise = deleteExercise;
	    	$scope.addNewExercise = addNewExercise;
	    	$scope.getLastEntryCalories = getLastEntryCalories;
	    	$scope.addNewRowToCaloriesTable = addNewRowToCaloriesTable;
	    	$scope.updateCalories = updateCalories;
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
        currentDate();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
      getExerciseLog();
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
           	//  getExerciseLog();
              $scope.openModal();
            }
          }
          ]
        });
        $scope.closeChooseRoutinePopup = function(){
	        routinepopup.close();
	   }
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
              addNewExercise();
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
     	getLastEntryCalories();
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
			$scope.tempIDRoutine = id;
			getExerciseLog();
			$scope.choseRoutine =true;
		}

		function fetchEntriesSuccessCB(response)
		{
			if(response && response.rows && response.rows.length > 0)
			{
				for(var i=0;i<response.rows.length;i++)
				{
					$scope.exerciseLogArray.push({
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
					getExerciseLog();
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
		{	$scope.exerciseLogArray=[];

			if(response && response.rows && response.rows.length > 0)
			{
				$scope.totalCal = 0;
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
					$scope.totalCal = $scope.totalCal+ response.rows.item(i).calOut;
					
				}
				if($scope.isFirstTime == true){
					$scope.isFirstTime = false;
				}else{
					updateCalories();
				}
			}else
			{
				alert("No entries created till now.");
			}

			if($scope.choseRoutine ==true){
				RoutineService.getAllEntries($scope.tempIDRoutine)
				.then(fetchEntriesSuccessCB,fetchEntriesErrorCB);
				$scope.choseRoutine = false;
			}
		}

		function fetchLogErrorCB(error)
		{
			alert("Some error occurred in fetching log exercises");
		}

		function saveLog(){
			try{
				if($scope.dateExist==true){
					ExerciseWidgetService.deleteExercises($scope.cDate)
					.then(function(response){
						console.log("Removing all entries in database");
						addNewLog();
					},function(error){

					})
				}else{
					console.log("Adding new log");
					addNewLog();
				}
			}catch(e){
				alert("Error in addDeleteLog controller "+e.message);
			}
		}

		function addNewLog(){
			try{
				var counter = 0;
				if($scope.exerciseLogArray.length>0){
					console.log("exerciseLogArray.length is "+$scope.exerciseLogArray.length);
					for(var j=0; j<$scope.exerciseLogArray.length; j++){
						ExerciseWidgetService.addNewExercises($scope.exerciseLogArray[j].exeName, $scope.exerciseLogArray[j].exeNumber, $scope.exerciseLogArray[j].exeUnit, $scope.exerciseLogArray[j].exeSet, $scope.exerciseLogArray[j].exeCal)
						.then(function(response){
							counter++;
							if(counter == $scope.exerciseLogArray.length){
								alert("Saved");
								
								getExerciseLog();
							}
						},function(error){
							//Error
						});
					}
				}
				
			}catch(e){
				alert("Error in addNewLog controller "+e.message);
			}
		}


		function deleteExercise(index){
			try{
				if(index>-1){
					$scope.exerciseLogArray.splice(index,1);
					console.log("exerciseLogArray length is "+$scope.exerciseLogArray.length+" after splice");
				}
			}catch(e){
				alert("Error in deleteExercise controller");
			}

		}

		function addNewExercise(){
			try{
				if($scope.exeName.name!='' && $scope.exeNumber.number>0 && $scope.exeSet.set>0){
					$scope.exerciseLogArray.push({
						id:$scope.exerciseLogArray[$scope.exerciseLogArray.length-1].id+1,
						created_at:$scope.cDate,
						exeName:$scope.exeName.name,
						exeNumber:$scope.exeNumber.number,
						exeUnit:$scope.exeUnit.name,
						exeSet:$scope.exeSet.set,
						exeCal:$scope.exeCal.value
					});
					console.log("exerciseLogArray length is "+$scope.exerciseLogArray.length+" after adding");
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
		function getLastEntryCalories(){
      		try{
		        CaloriesWidgetService.getLastEntry()
		        .then(fetchCaloriesSuccessCB,fetchCaloriesErrorCB);
		      }catch(e){
		        alert("Error in fetch getLastEntryCalories controller "+e.message);
		      }
      	}

      	function fetchCaloriesSuccessCB(response)
	    {
	      try{
	        if(response && response.rows && response.rows.length > 0)
	        {
	          
	          $scope.caloriesArray = [];
	    //   	  console.log("number of rows for calories is "+response.rows.length);
	          for(var i=0;i<response.rows.length;i++)
	          {
	            $scope.caloriesArray.push
	            ({
	              id:response.rows.item(i).id,
	              cDate:response.rows.item(i).created_at,
	              caloriesIn:response.rows.item(i).calories_in,
	              caloriesOut:response.rows.item(i).calories_out,
	              caloriesTotal:response.rows.item(i).calories_total,
	            });
	          }
	          if($scope.cDate==$scope.caloriesArray[0].cDate){
	          	
	          		$scope.calories.inCal = $scope.caloriesArray[0].caloriesIn;
      				$scope.calories.outCal = $scope.caloriesArray[0].caloriesOut;
      				$scope.calories.totalCalories = $scope.caloriesArray[0].caloriesTotal;
      				$scope.tempIDCalories = $scope.caloriesArray[0].id;
	          }else{
	          	
	          	console.log("in cDate if else "+$scope.cDate+" != "+$scope.caloriesArray[0].cDate);
	         	addNewRowToCaloriesTable();
	          }
	        }else
	        {
	          alert("No calories created till now.");
	          console.log("in No calories created till now else");
	          addNewRowToCaloriesTable();
	        }
	      }catch(e){
	        alert("Error in fetchCaloriesSuccessCB controller "+e.message);
	      }
	      
	    }

	    function fetchCaloriesErrorCB(error)
	    {
	      alert("Some error occurred in fetchCaloriesErrorCB");
	    }

	    function addNewRowToCaloriesTable(){
	    	try{
	    		CaloriesWidgetService.addNewRow($scope.calories.inCal, $scope.calories.outCal, $scope.calories.totalCalories)
		    	.then(function(response){
		    		
		    		getLastEntryCalories();
		    	},function(error){
		    		alert("Error in adding new row to calories table");
		    	});
	    	}catch(e){
	    		alert("Error in addNewRowToCaloriesTable controller "+e.message);
	    	}
	    	
	    }

	    function updateCalories(){
	    	try{
	    		$scope.calories.totalCalories = $scope.calories.inCal - $scope.totalCal;
	    		console.log($scope.calories.totalCalories+"= "+ $scope.calories.inCal+"- "+  $scope.totalCal);
	    		CaloriesWidgetService.updateCalories($scope.calories.inCal,$scope.totalCal,$scope.calories.totalCalories,$scope.tempIDCalories)
	    		.then(function(response){
	    			console.log("Updated calories");
	    			getLastEntryCalories();
	    			$rootScope.$broadcast('updateCaloriesInWidget');
	    		},function(error){
		    		alert("Error in updating calories table");
	    		})
	    	}catch(e){
	    		alert("Error in updateCalories controller "+e.message);

	    	}
	    }
}]);