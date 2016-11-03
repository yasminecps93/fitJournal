var foodWidgetModule = angular.module('FoodWidget',['ngCordova','ionic']);

foodWidgetModule.controller('FoodWidgetCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','MealsService','CaloriesWidgetService','$ionicModal','$window','$rootScope',
	function($scope,$state,$cordovaSQLite,$ionicPlatform, MealsService, CaloriesWidgetService, $ionicModal, $window, $rootScope){
    
	    initData();
	    initMethods();

	    function initData(){
	    	$scope.cDate="";
	    	$scope.numericDate="";
	    	$scope.date_id=-1;
	    	$scope.tempIDCalories =0;
	    	$scope.foodName={
				name: ''
			};
			$scope.foodCal={
				value:0
			};
			$scope.calories = {
	    		inCal : 0,
	    		outCal : 0,
	    		totalCalories : 0
	    	}
	    	$scope.checkedCalorieService = false;
			$scope.showExtra = false;
			$scope.dateExist= false;
			$scope.isAdded= false;
			$scope.headerToEdit = '';
			$scope.shouldShowDelete = false;
			
			$scope.editButtonLabel = "Edit";
			$scope.mealPlannerList = [];
			MealsService.initDB();
			CaloriesWidgetService.initDB();
			fetchMeals();
		//	currentDate();
	    }
	    function initMethods(){
	    	$scope.toggleEdit = toggleEdit;
	    	$scope.currentDate = currentDate;
	    	$scope.checkExistingMealPlanner = checkExistingMealPlanner;
			$scope.addNewMealPlanner = addNewMealPlanner;
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
	    }
	    
	    function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}

	    $scope.toggleBreakfast = function(){
	      $scope.showBreakfast = !$scope.showBreakfast;
	    };  
	    $scope.toggleLunch = function(){
	      $scope.showLunch = !$scope.showLunch;
	    }; 
	    $scope.toggleDinner = function(){
	      $scope.showDinner = !$scope.showDinner;
	    }; 
	    $scope.toggleSnack = function(){
	      $scope.showSnack = !$scope.showSnack;
	    }; 

//------------------------------------------------------------------//
//--------------------------CHECK DATE------------------------------//
//------------------------------------------------------------------//
		function currentDate(){
			var monthsList= ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
		    var i = new Date().getMonth();
		    var month = monthsList[i];
		    var numericMonth = new Date().getMonth() + 1;
		    $scope.cDate = new Date().getDate()+ " "+month + " " + new Date().getFullYear();
		    var date = new Date().getDate();
	          if(date<10){
	          	$scope.numericDate = new Date().getFullYear()+ "-"+ numericMonth + "-0" + new Date().getDate();
	          }else{
	          	$scope.numericDate = new Date().getFullYear()+ "-"+ numericMonth + "-" + new Date().getDate(); 
	          }

			checkExistingMealPlanner();
			getLastEntry();
		}

		function checkExistingMealPlanner(){
			try{
				if($scope.mealPlannerList.length>0){
					for(var i=0; i<$scope.mealPlannerList.length; i++){
						if($scope.cDate==$scope.mealPlannerList[i].dateName){
							$scope.dateExist=true;
							$scope.isAdded=false;
							$scope.date_id=$scope.mealPlannerList[i].id;
							fetchEntries();
							break;
						}
					}
					if($scope.dateExist==false){
						addNewMealPlanner();
					}	
				}else{
					if($scope.dateExist==false){
						addNewMealPlanner();
					}
				}
					
			}catch(e){
				console.log("Error in checkExistingMealPlanner controller "+e.message);
			}
		}

		function checkCaloriesDate(){
			if($scope.caloriesArray.length>0){
				if($scope.numericDate == $scope.caloriesArray[0].cDate){
      				$scope.calories.inCal = $scope.caloriesArray[0].caloriesIn;
      				$scope.calories.outCal = $scope.caloriesArray[0].caloriesOut;
      				$scope.calories.totalCalories = $scope.caloriesArray[0].caloriesTotal;
      				$scope.tempIDCalories = $scope.caloriesArray[0].id;
      				$scope.checkedCalorieService = true;
      				console.log("totalCal: "+$scope.calories.totalCalories+", inCal: "+$scope.calories.inCal+", outCal: "+$scope.calories.outCal);
      			}else{
      				console.log($scope.numericDate+"!="+ $scope.caloriesArray[0].created_at);
      				addNewRowToCaloriesTable();
      			}
			}
		}
//---------------------------------------------------------------------------------
//----------------------OPEN MODAL FUNCTIONS---------------------------------------
//---------------------------------------------------------------------------------
		$ionicModal.fromTemplateUrl('add-food-modal.html',{
			id:'1',
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal){
			$scope.modal1 = modal;
		});
		
		$ionicModal.fromTemplateUrl('meals-modal.html',{
			id:'2',
			scope: $scope,
			animation: 'slide-in-up'
		}).then(function(modal){
			$scope.modal2 = modal;
		});

		$scope.openModal = function(index){
			if(index == 1){
				$scope.checkedCalorieService = false;
				$scope.modal1.show();
				currentDate();
			}else{
				if($scope.date_id<0){
					console.log("cDate is empty, check currentDate function");
				}else{
					$scope.modal2.show();
					$scope.foodName={
						name: ''
					};
					$scope.foodCal={
						value:0
					};
				}
			}
			
		};

		$scope.closeModal = function(index){
			if (index == 1) {
				$scope.modal1.hide();
				//$window.location.reload(true);
			}
      		else $scope.modal2.hide();


		};
		$scope.$on('$destroy', function(){
			$scope.modal1.remove();
      		$scope.modal2.remove();
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
//------------------------------------------------------------------//
//----------------------MEALS FUNCTIONS-----------------------------//
//------------------------------------------------------------------//
		function fetchMeals() {
			MealsService.getAllMealPlanner()
			.then(fetchMealPlannerSuccessCB,fetchMealPlannerErrorCB);
		}

		function fetchMealPlannerSuccessCB(response)
		{
			try{

				var lastId= response.rows.length - 1;
				if(response && response.rows && response.rows.length > 0)
				{	
					$scope.mealPlannerList = [];
					for(var i=0;i<response.rows.length;i++)
					{
						$scope.mealPlannerList.push({
							id:response.rows.item(i).id,
							dateName:response.rows.item(i).dateName
						});
					}
					currentDate();
					if($scope.isAdded==true){
						$scope.date_id=$scope.mealPlannerList[lastId].id;
						fetchEntries();
						$scope.isAdded=false;
					}
				}else
				{
					console.log("No dates created till now.");
					currentDate();
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

				if($scope.cDate != ''){

					MealsService.addNewMealPlanner($scope.cDate)
					.then(function(response){
						$scope.isAdded=true;
						fetchMeals();	
						console.log("Added new meal date");
					},function(error){
						console.log("Error in adding new MealPlanner");
					});
				}else
				{
					console.log('cDate is empty check currentDate function');
				}
			}catch(e){
				console.log("Error in addNewMealPlanner controller "+e.message);
			}
			
		}
//------------------------------------------------------------------//
//---------------------FOOD ENTRY FUNCTIONS-------------------------//
//------------------------------------------------------------------//
		function fetchEntries() {
		
			$scope.breakfastCal=0;
			$scope.lunchCal=0;
			$scope.dinnerCal=0;
			$scope.snackCal=0;
			try{
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
					if($scope.checkedCalorieService == true){
						updateCalories();
					}
					
					$scope.dateExist = false;
				}else
				{
					console.log("No entries created till now.");
					$scope.entriesList = [];
					$scope.breakfastList=[];
					$scope.lunchList=[];
					$scope.dinnerList=[];
					$scope.snackList=[];
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
						// $scope.breakfastList.splice(index,1);
						// $scope.entriesList.splice(index,1);
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
						// $scope.lunchList.splice(index,1);
						// $scope.entriesList.splice(index,1);
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
						// $scope.dinnerList.splice(index,1);
						// $scope.entriesList.splice(index,1);
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
						// $scope.snackList.splice(index,1);
						// $scope.entriesList.splice(index,1);
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
					console.log("New Entry has been added. "+ $scope.date_id);
					$scope.foodName={
					name: ''
					};
					$scope.foodCal={
						value:0
					};
					alert("Saved");
					fetchEntries();
				},function(error){
					console.log("Error in adding new entry");
				});
				}else
					{
						console.log('Please enter food name.');
					}
			}catch(e){
				console.log("cannot enter addNewEntry function" + e.code +", "+e.message);
			}
			
		}

//-----------------------------------------------------------------------------------//
//------------------------FILTER ARRAY-----------------------------------------------//
//-----------------------------------------------------------------------------------//
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
						console.log('Please enter a food name.');
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

	    function addNewRowToCaloriesTable(){
	    	try{
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
	    		console.log($scope.calories.totalCalories+"= "+ $scope.totalCal+"- "+  $scope.calories.outCal);
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