var caloriesWidgetModule = angular.module('CaloriesWidget',['ngCordova','ionic']);

caloriesWidgetModule.controller('CaloriesWidgetCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','CaloriesWidgetService','$rootScope',
	function($scope,$state,$cordovaSQLite,$ionicPlatform, CaloriesWidgetService, $rootScope){
    
	    initData();
	    initMethods();

	    function initData(){
	    	$scope.caloriesArray=[];
	    	$scope.calories = {
	    		inCal : 0,
	    		outCal : 0,
	    		totalCal : 0
	    	}
	    	
	    	CaloriesWidgetService.initDB();
	    	currentDate();
	    	$rootScope.$on('updateCaloriesInWidget',function(){
	    		console.log("calling updateCalories");
	    		getLastEntry();
	    	});
	    }

	    function initMethods(){
	    	$scope.checkDate = checkDate;
	    	$scope.getLastEntry=getLastEntry;
	    	
	    }

	    function currentDate(){
          var month = new Date().getMonth() + 1;
          var date = new Date().getDate();
          if(date<10){
          	$scope.cDate = new Date().getFullYear()+ "-"+ month + "-0" + new Date().getDate();
          }else{
          	$scope.cDate = new Date().getFullYear()+ "-"+ month + "-" + new Date().getDate(); 
          }
      		getLastEntry();
      	}

      	function checkDate(){
      		if($scope.caloriesArray.length>0){
      			if($scope.cDate == $scope.caloriesArray[0].cDate){
      				$scope.calories.inCal = $scope.caloriesArray[0].caloriesIn;
      				$scope.calories.outCal = $scope.caloriesArray[0].caloriesOut;
      				$scope.calories.totalCal = $scope.caloriesArray[0].caloriesTotal;
      				console.log("In: "+$scope.calories.inCal+", Out: "+$scope.calories.outCal+", Total: "+$scope.calories.totalCal);
      			}
      		}
      	}

      	function getLastEntry(){
      		try{
		        CaloriesWidgetService.getLastEntry()
		        .then(fetchSuccessCB,fetchErrorCB);
		      }catch(e){
		        alert("Error in fetch getLastEntry controller CaloriesWidget"+e.message);
		      }
      	}

      	function fetchSuccessCB(response)
	    {
	      try{
	        if(response && response.rows && response.rows.length > 0)
	        {
	          
	          $scope.caloriesArray = [];
	       		console.log("in calories widget ctrl number of rows for calories is "+response.rows.length);
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
	          checkDate();
	        }else
	        {
	          alert("No calories created till now.");
	        }
	      }catch(e){
	        alert("Error in fetchSuccessCB controller "+e.message);
	      }
	      
	    }

	    function fetchErrorCB(error)
	    {
	      alert("Some error occurred in fetchErrorCB");
	    }

	    
}]);