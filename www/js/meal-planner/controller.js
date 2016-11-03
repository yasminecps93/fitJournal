var mealPlannerModule = angular.module('MealPlanner',['ngCordova','ionic','ionic-datepicker']);

mealPlannerModule.controller('MealPlannerListCtrl',['$scope','$cordovaSQLite','$ionicPlatform','ionicDatePicker','MealsService','$ionicModal','CaloriesWidgetService','$rootScope',
	function($scope,$cordovaSQLite,$ionicPlatform,ionicDatePicker,MealsService, $ionicModal, CaloriesWidgetService,$rootScope){

		initData();
		initMethods();
		
		function initData(){
			$scope.newDate = {
				dateName: ''
			};
			$scope.date_id=-1;
			$scope.foodName={
				name: ''
			};
			$scope.foodCal={
				value:0
			};
			
			$scope.breakfastCal = 0;
			$scope.lunchCal = 0;
			$scope.dinnerCal = 0;
			$scope.snackCal = 0;
			$scope.cDate = '';
			$scope.loadingEntries = false;

			$scope.dateExist= false;
			$scope.isAdded= false;
			$scope.headerToEdit = '';
			$scope.shouldShowDelete = false;
			$scope.editButtonLabel = "Edit";
			$scope.mealPlannerList=[];
			MealsService.initDB();
			fetchMeals();
		}

		function initMethods() {
			$scope.addNewMealPlanner = addNewMealPlanner;
			$scope.checkExistingMealPlanner = checkExistingMealPlanner;
			$scope.toggleEdit = toggleEdit;
			$scope.deleteBreakfast = deleteBreakfast;
			$scope.deleteLunch = deleteLunch;
			$scope.deleteDinner = deleteDinner;
			$scope.deleteSnack = deleteSnack;
			$scope.fetchEntries = fetchEntries;
			$scope.addNewEntry = addNewEntry;
			$scope.setAsBreakfast = setAsBreakfast;
			$scope.setAsLunch = setAsLunch;
			$scope.setAsDinner = setAsDinner;
			$scope.setAsSnack = setAsSnack;
			$scope.addNewEntryByFiltered = addNewEntryByFiltered;
			$scope.getLastEntry = getLastEntry;
			$scope.addNewRowToCaloriesTable = addNewRowToCaloriesTable;
			$scope.updateCalories = updateCalories;
			$scope.currentDate = currentDate;
		//	$scope.deleteAllFromTable = deleteAllFromTable;

		}

		function deleteAllFromTable(){
			MealsService.deleteAllFromTable().then(function(response){
					//$scope.newRoutine.name = '';
			//		alert("Table has been cleared");
				//	fetchMeals();
				},function(error){
					console.log("Error in clearing table");
				});
		}

		function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}

//--------------------------------------------------------------------------------------------------------//
//------------------------------------DATE PICKER AND CHECK DATE------------------------------------------//
//--------------------------------------------------------------------------------------------------------//		

		var gDate = {

		    callback: function (val) {  //Mandatory
		      console.log('Return value from the datepicker popup is : ' + val, new Date(val));

		      var monthsList= ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
		      var dateToString = "";
		      var oneDay = 24*60*60*1000;
		      var newDate = new Date(val);
		      displayDate = function(){
		      	$scope.checkedCaloriesService = false;
		        var i = new Date(val).getMonth();
		        var month = monthsList[i];
		        dateToString = new Date(val).getDate()+ " "+ month + " " + new Date(val).getFullYear();
		        $scope.newDate.dateName =dateToString;  
		        checkExistingMealPlanner(); 
		        currentDate();
		        console.log(dateToString);
		      }

		      displayDate();
		    }
	  	};
	  	function currentDate(){
	  		//console.log("Checking calories date");
	  		$scope.itsToday = false;
	  		var monthsList= ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
	  		var i = new Date().getMonth();
		    var month = monthsList[i];
		    var numericMonth = new Date().getMonth() + 1;
	  		$scope.cDate = new Date().getDate()+ " "+ month + " " + new Date().getFullYear();
	  		 var date = new Date().getDate();
	          if(date<10){
	          	$scope.numericDate = new Date().getFullYear()+ "-"+ numericMonth + "-0" + new Date().getDate();
	          }else{
	          	$scope.numericDate = new Date().getFullYear()+ "-"+ numericMonth + "-" + new Date().getDate(); 
	          }
	  		if ($scope.cDate == $scope.newDate.dateName){
	  			$scope.itsToday = true;
	  		//	console.log("$scope.itsToday "+$scope.itsToday);
	  			getLastEntry();
	  		}
	  	}

	  	$scope.openDatePicker = function(){
	      ionicDatePicker.openDatePicker(gDate);
	  	};

	  	function checkExistingMealPlanner(){
			try{

				if($scope.mealPlannerList.length>0){

					for(var i=0; i<$scope.mealPlannerList.length; i++){
						if($scope.newDate.dateName==$scope.mealPlannerList[i].dateName){
							$scope.dateExist=true;
							$scope.isAdded=false;
							$scope.date_id=$scope.mealPlannerList[i].id;
							fetchEntries();
							break;
						}
					}
			//		alert("dateExist= "+$scope.dateExist);
					if($scope.dateExist==false){
						addNewMealPlanner();
					}	
				}else{
			//		alert("dateExist= "+$scope.dateExist);
					if($scope.dateExist==false){
						addNewMealPlanner();
					}
				}
					
			}catch(e){
				console.log("Error in checkExistingMealPlanner controller "+e.message);
			}
		}
//---------------------------------------------------------------------------------//
//----------------------OPEN MODAL FUNCTIONS---------------------------------------//
//---------------------------------------------------------------------------------//

		$ionicModal.fromTemplateUrl('meals-modal.html',{
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal){
			$scope.modal = modal;
		});

		$scope.openModal = function(){
			if($scope.date_id<0){
				alert("Please select a date first");
			}else{
				$scope.modal.show();
				$scope.foodName={
					name: ''
				};
				$scope.foodCal={
					value:0
				};
			}
		};
		$scope.closeModal = function(){
			$scope.modal.hide();
		};
		$scope.$on('$destroy', function(){
			$scope.modal.remove();
		});

		function setAsBreakfast(){
			$scope.headerToEdit = 'Breakfast';
		}

		function setAsLunch(){
			$scope.headerToEdit = 'Lunch';
		}
		function setAsDinner(){
			$scope.headerToEdit = 'Dinner';
		}
		function setAsSnack(){
			$scope.headerToEdit = 'Snack';
		}

//-----------------------------------------------------------------------------------------------//
//---------------------------------MEALS FUNCTIONS-----------------------------------------------//
//-----------------------------------------------------------------------------------------------//		

		function fetchMeals() {
			MealsService.getAllMealPlanner()
			.then(fetchMealPlannerSuccessCB,fetchMealPlannerErrorCB);
		}

		function fetchMealPlannerSuccessCB(response)
		{
			try{
			//	deleteAllFromTable();
				var lastId= response.rows.length - 1;
				if(response && response.rows && response.rows.length > 0)
				{	
					$scope.mealPlannerList = [];
					for(var i=0;i<response.rows.length;i++)
					{
						$scope.mealPlannerList.push({
							id:response.rows.item(i).id,
							created_at:response.rows.item(i).created_at,
							dateName:response.rows.item(i).dateName
						});
					}
					if($scope.isAdded==true){
						$scope.date_id=$scope.mealPlannerList[lastId].id;
						fetchEntries();
						$scope.isAdded=false;
					}
				}else
				{
					console.log("No dates created till now.");
				}
			}catch(e){
				console.log("Error in fetchMealPlannerSuccessCB controller "+e.message);
			}
			
		}

		function fetchMealPlannerErrorCB(error)
		{
			console.log("Some error occurred in fetchMealPlanner");
		}

		

		function addNewMealPlanner()
		{
			try{

				if($scope.newDate.dateName != ''){

					MealsService.addNewMealPlanner($scope.newDate.dateName)
					.then(function(response){
						$scope.isAdded=true;
						fetchMeals();	
					},function(error){
						console.log("Error in adding new MealPlanner");
					});
				}else
				{
					console.log('Please select a date.');
				}
			}catch(e){
				console.log("Error in addNewMealPlanner controller "+e.message);
			}
			
		}
		
//---------------------------------------------------------------------------------
//------------------ENTRY CONTROLLER-------------------------------------------
//---------------------------------------------------------------------------------


		function fetchEntries() {
			$scope.loadingEntries = true;
			$scope.breakfastCal=0;
			$scope.lunchCal=0;
			$scope.dinnerCal=0;
			$scope.snackCal=0;
			try{
		//		alert("$scope.date_id is "+$scope.date_id);
				MealsService.getAllEntries($scope.date_id)
				.then(fetchEntriesSuccessCB,fetchMealPlannerErrorCB);
				MealsService.getAllEntriesForArray()
				.then(fetchEntriesForArraySuccessCB,fetchMealPlannerErrorCB);
			}catch(e){
				console.log("Error in fetchEntries "+ e.message);
			}
			
		}

		function fetchEntriesSuccessCB(response)
		{
			try{
				$scope.loadingEntries = false;
				if(response && response.rows && response.rows.length > 0)
				{
					$scope.entriesList = [];
					$scope.breakfastList=[];
					$scope.lunchList=[];
					$scope.dinnerList=[];
					$scope.snackList=[];
					$scope.totalCal = 0;
					for(var i=0;i<response.rows.length;i++)
					{
						$scope.entriesList.push({
							id:response.rows.item(i).id,
							mealType:response.rows.item(i).mealType,
							foodName:response.rows.item(i).foodName,
							foodCal:response.rows.item(i).foodCal
						});

						if(response.rows.item(i).mealType=="Breakfast"){
							$scope.breakfastList.push({
							id:response.rows.item(i).id,
							mealType:response.rows.item(i).mealType,
							foodName:response.rows.item(i).foodName,
							foodCal:response.rows.item(i).foodCal
							});
							$scope.breakfastCal = $scope.breakfastCal + response.rows.item(i).foodCal;
						}else if(response.rows.item(i).mealType=="Lunch"){
							$scope.lunchList.push({
							id:response.rows.item(i).id,
							mealType:response.rows.item(i).mealType,
							foodName:response.rows.item(i).foodName,
							foodCal:response.rows.item(i).foodCal
							});
							$scope.lunchCal = $scope.lunchCal + response.rows.item(i).foodCal;
						}else if(response.rows.item(i).mealType=="Dinner"){
							$scope.dinnerList.push({
							id:response.rows.item(i).id,
							mealType:response.rows.item(i).mealType,
							foodName:response.rows.item(i).foodName,
							foodCal:response.rows.item(i).foodCal
							});
							$scope.dinnerCal = $scope.dinnerCal + response.rows.item(i).foodCal;
						}else if(response.rows.item(i).mealType=="Snack"){
							$scope.snackList.push({
							id:response.rows.item(i).id,
							mealType:response.rows.item(i).mealType,
							foodName:response.rows.item(i).foodName,
							foodCal:response.rows.item(i).foodCal
							});
							$scope.snackCal = $scope.snackCal + response.rows.item(i).foodCal;
						}
					}
					$scope.totalCal = $scope.breakfastCal + $scope.lunchCal + $scope.dinnerCal + $scope.snackCal;
					$scope.dateExist = false;
					if($scope.checkedCaloriesService == true){
						if($scope.itsToday==true){
							updateCalories();
						}
					}
					
				}else
				{
					console.log("No entries created till now.");
					$scope.entriesList = [];
					$scope.breakfastList=[];
					$scope.lunchList=[];
					$scope.dinnerList=[];
					$scope.snackList=[];
					$scope.breakfastCal = 0;
					$scope.lunchCal = 0;
					$scope.dinnerCal = 0;
					$scope.snackCal = 0;
					$scope.totalCal = 0;
				}

			}catch(e){
				console.log("Error in fetchEntries controller "+e.message);
			}
			
			
		}

		function deleteBreakfast(index,id)
		{
			try{
				if(index > -1)
				{
					MealsService.deleteEntry(id)
					.then(function(response){
						$scope.breakfastList.splice(index,1);
						$scope.entriesList.splice(index,1);
				//		alert("Entry has been succesfully deleted.");
						fetchEntries();
					},function(error){
						console.log("Error in delete new entry");
					});
				}
			}catch(e){
				console.log("Error in deleteBreakfast "+e.message);
			}
			
		}

		function deleteLunch(index,id)
		{
			try{
				if(index > -1)
				{
					MealsService.deleteEntry(id)
					.then(function(response){
						$scope.lunchList.splice(index,1);
						$scope.entriesList.splice(index,1);
					//	alert("Entry has been succesfully deleted.");
						fetchEntries();
					},function(error){
						console.log("Error in adding new entry");
					});
				}
			}catch(e){
				console.log("Error in deleteLunch "+e.message);
			}
			
		}

		function deleteDinner(index,id)
		{
			try{
				if(index > -1)
				{
					MealsService.deleteEntry(id)
					.then(function(response){
						$scope.dinnerList.splice(index,1);
						$scope.entriesList.splice(index,1);
				//		alert("Entry has been succesfully deleted.");
						fetchEntries();
					},function(error){
						console.log("Error in adding new entry");
					});
				}
			}catch(e){
				console.log("Error in deleteDinner "+e.message);
			}
			
		}

		function deleteSnack(index,id)
		{
			try{
				if(index > -1)
				{
					MealsService.deleteEntry(id)
					.then(function(response){
						$scope.snackList.splice(index,1);
						$scope.entriesList.splice(index,1);
				//		alert("Entry has been succesfully deleted.");
						fetchEntries();
					},function(error){
						console.log("Error in adding new entry");
					});
				}
			}catch(e){
				console.log("Error in deleteSnack "+e.message);
			}
			
		}

		function addNewEntry()
		{

			try{
				if($scope.foodName.name!= '' && $scope.headerToEdit!=''){
				MealsService.addNewEntry($scope.date_id,$scope.headerToEdit,$scope.foodName.name,$scope.foodCal.value)
				.then(function(response){
				//	$scope.newEntry.value = 0;
					alert("Saved");
					$scope.foodName={
					name: ''
					};
					$scope.foodCal={
						value:0
					};
					fetchEntries();
				},function(error){
					console.log("Error in adding new entry");
				});
				}else
					{
						alert('Empty inputs!');
					}
			}catch(e){
				console.log("cannot enter addNewEntry function" + e.code +", "+e.message);
			}
			
		}

//-----------------------------------------------------------------------------------
//------------------------FILTER ARRAY-----------------------------------------------
//-----------------------------------------------------------------------------------
		function fetchEntriesForArraySuccessCB(response){
				
			try{
				if(response && response.rows && response.rows.length > 0)
				{
					$scope.arrayList=[];
				
					for(var i=0;i<response.rows.length;i++)
					{	
						$scope.arrayList.push({
							foodName:response.rows.item(i).foodName,
							foodCal:response.rows.item(i).foodCal
						});
		
					}
				}
			}catch(e){
				console.log(e.message);
			}
				
		}


		function addNewEntryByFiltered(foodName, foodCal)
		{

			try{
				if(foodName!= '' && $scope.headerToEdit!=''){
				MealsService.addNewEntry($scope.date_id,$scope.headerToEdit,foodName,foodCal)
				.then(function(response){
				//	$scope.newEntry.value = 0;
					alert("Saved");
					$scope.foodName={
					name: ''
					};
					$scope.foodCal={
						value:0
					};
					fetchEntries();
				},function(error){
					console.log("Error in adding new entry");
				});
				}else
					{
						alert('Empty inputs!');
					}
			}catch(e){
				console.log("cannot enter addNewEntry function" + e.code +", "+e.message);
			}
			
		}

//-----------------------------------------------------------------------------------//
//------------------------Calorie Counter Function-----------------------------------//
//-----------------------------------------------------------------------------------//
		function getLastEntry(){
      		try{
		        CaloriesWidgetService.getLastEntry()
		        .then(fetchCaloriesSuccessCB,fetchCaloriesErrorCB);
		      }catch(e){
		        console.log("Error in fetch getLastEntry controller FoodWidget "+e.message);
		      }
      	}

      	function fetchCaloriesSuccessCB(response)
	    {
	      try{
	        if(response && response.rows && response.rows.length > 0)
	        {
	          
	          $scope.caloriesArray = [];
	       	  console.log("number of rows for calories is "+response.rows.length);
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
	          checkCaloriesDate();
	        }else
	        {
	          console.log("No calories created till now.");
	          addNewRowToCaloriesTable();
	        }
	      }catch(e){
	        console.log("Error in fetchCaloriesSuccessCB controller "+e.message);
	      }
	      
	    }

	    function fetchCaloriesErrorCB(error)
	    {
	      console.log("Some error occurred in fetchCaloriesErrorCB");
	    }

	    function checkCaloriesDate(){
	    	$scope.calories = {
		    		inCal : 0,
		    		outCal : 0,
		    		totalCalories : 0
		    }
			if($scope.caloriesArray.length>0){
				if($scope.numericDate == $scope.caloriesArray[0].cDate){
      				$scope.calories.inCal = $scope.caloriesArray[0].caloriesIn;
      				$scope.calories.outCal = $scope.caloriesArray[0].caloriesOut;
      				$scope.calories.totalCalories = $scope.caloriesArray[0].caloriesTotal;
      				$scope.tempIDCalories = $scope.caloriesArray[0].id;
      				$scope.checkedCaloriesService = true;
      				console.log("checkCaloriesDate totalCal: "+$scope.calories.totalCalories+", inCal: "+$scope.calories.inCal+", outCal: "+$scope.calories.outCal);
      			}else{
      				console.log("checkCaloriesDate "+$scope.cDate+"!="+ $scope.caloriesArray[0].cDate);
      				addNewRowToCaloriesTable();
      			}
			}
		}

	    function addNewRowToCaloriesTable(){
	    	try{
	    		$scope.calories = {
		    		inCal : 0,
		    		outCal : 0,
		    		totalCalories : 0
		    	}
	    		CaloriesWidgetService.addNewRow($scope.calories.inCal, $scope.calories.outCal, $scope.calories.totalCalories)
		    	.then(function(response){
		    		getLastEntry();
		    	},function(error){
		    		console.log("Error in adding new row to calories table");
		    	});
	    	}catch(e){
	    		console.log("Error in addNewRowToCaloriesTable controller "+e.message);
	    	}
	    	
	    }

	    function updateCalories(){
	    	try{
	    		$scope.calories.totalCalories = $scope.totalCal - $scope.calories.outCal;
	    		console.log("updateCalories "+$scope.calories.totalCalories+"= "+ $scope.totalCal+"- "+  $scope.calories.outCal);
	    		CaloriesWidgetService.updateCalories($scope.totalCal,$scope.calories.outCal,$scope.calories.totalCalories,$scope.tempIDCalories)
	    		.then(function(response){
	    			console.log("Updated calories");
	    			getLastEntry();
	    			$rootScope.$broadcast('updateCaloriesInWidget');
	    		},function(error){
		    		console.log("Error in updating calories table");
	    		})
	    	}catch(e){
	    		console.log("Error in updateCalories controller "+e.message);

	    	}
	    }

}]);
