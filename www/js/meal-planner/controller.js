var mealPlannerModule = angular.module('MealPlanner',['ngCordova','ionic','ionic-datepicker']);

mealPlannerModule.controller('MealPlannerListCtrl',['$scope','$cordovaSQLite','$ionicPlatform','ionicDatePicker','MealsService',
	function($scope,$cordovaSQLite,$ionicPlatform,ionicDatePicker,MealsService){

		initData();
		initMethods();
		$scope.date_id=0;
		function initData(){
			$scope.newDate = {
				dateName: ''
			};
			$scope.loadingMeals = false;
			$scope.isAvailable= false;
			$scope.arrayAvailable= false;
			$scope.isAdded= false;
			MealsService.initDB();
			fetchMeals();
		}

		function initMethods() {
			$scope.addNewMealPlanner = addNewMealPlanner;
			$scope.checkExistingMealPlanner = checkExistingMealPlanner;
		//	$scope.deleteAllFromTable = deleteAllFromTable;
		//	$scope.fetchMeals = fetchMeals;
		}

		function deleteAllFromTable(){
			MealsService.deleteAllFromTable().then(function(response){
					//$scope.newRoutine.name = '';
					alert("Table has been cleared");
				//	fetchMeals();
				},function(error){
					alert("Error in clearing table");
				});
		}

		var gDate = {
		    callback: function (val) {  //Mandatory
		      console.log('Return value from the datepicker popup is : ' + val, new Date(val));

		      var monthsList= ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
		      var dateToString = "";
		      var oneDay = 24*60*60*1000;
		      var newDate = new Date(val);
		      displayDate = function(){
		        var i = new Date(val).getMonth();
		        var month = monthsList[i];
		        dateToString = new Date(val).getDate()+ " "+ month + " " + new Date(val).getFullYear();
		        $scope.newDate.dateName =dateToString;  
		        checkExistingMealPlanner(); 
		        console.log(dateToString);
		      }

		      displayDate();
		    }
	  	};

	  	$scope.openDatePicker = function(){
	      ionicDatePicker.openDatePicker(gDate);
	  	};

		function fetchMeals() {
			$scope.loadingMeals = true;
			MealsService.getAllMealPlanner()
			.then(fetchMealPlannerSuccessCB,fetchMealPlannerErrorCB);
		}

		function checkExistingMealPlanner(){
			try{
			//	alert($scope.mealPlannerList);
				if(arrayAvailable==true){
				//	alert("mealPlannerList.length is "+$scope.mealPlannerList.length);
					for(var i=0; i<$scope.mealPlannerList.length; i++){
						if($scope.newDate.dateName==$scope.mealPlannerList[i].dateName){
							$scope.isAvailable=true;
							$scope.isAdded=false;
							$scope.date_id=$scope.mealPlannerList[i].id;
							break;
						}else{
							$scope.isAvailable=false;
							
						}
					}
					alert("isAvailable= "+$scope.isAvailable);
					if($scope.isAvailable==false){
						addNewMealPlanner();
					}	
				}else{
					alert("isAvailable= "+$scope.isAvailable);
					if($scope.isAvailable==false){
						addNewMealPlanner();
					}
				}
					
			}catch(e){
				alert("Error in checkExistingMealPlanner controller "+e.message);
			}
		}

		function addNewMealPlanner()
		{
			try{
				if($scope.newDate.dateName != ''){

					MealsService.addNewMealPlanner($scope.newDate.dateName)
					.then(function(response){
						//$scope.newRoutine.name = '';
						$scope.isAdded=true;
						alert("New MealPlanner has been added. "+($scope.newDate.dateName));
						fetchMeals();	
					//	$scope.date_id=$scope.mealPlannerList[$scope.mealPlannerList.length].id;
					},function(error){
						alert("Error in adding new MealPlanner");
					});
				}else
				{
					alert('Please enter the name of the MealPlanner.');
				}
			}catch(e){
				alert("Error in addNewMealPlanner controller "+e.message);
			}
			
		}

		function fetchMealPlannerSuccessCB(response)
		{
			try{
				$scope.loadingMeals = false;
			//	deleteAllFromTable();
				var lastId= response.rows.length - 1;
				if(response && response.rows && response.rows.length > 0)
				{	
					arrayAvailable=true;
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
					}
				}else
				{
					//$scope.message = "No routines created till now.";
					arrayAvailable=false;
				}
			}catch(e){
				alert("Error in fetchMealPlannerSuccessCB controller "+e.message);
			}
			
		}

		function fetchMealPlannerErrorCB(error)
		{
			$scope.loadingMeals = false;
			alert("Some error occurred in fetchMealPlanner");
		}

}]);
