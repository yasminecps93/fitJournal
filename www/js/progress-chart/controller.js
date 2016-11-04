var progressChartModule = angular.module('ProgressChart',['ngCordova','ionic','chart.js']);

progressChartModule.controller('ProgressChartCtrl',['$scope','$cordovaSQLite','$ionicPlatform','ionicDatePicker','WeightWidgetService','MeasurementsWidgetService',
	function($scope,$cordovaSQLite,$ionicPlatform,ionicDatePicker,WeightWidgetService,MeasurementsWidgetService){
	
	initData();
	initMethods();
	var ctx1 = document.getElementById('weightChart').getContext('2d');
	var ctx2 = document.getElementById('measurementChart').getContext('2d');
	

	function initData(){
		$scope.cDateWeight=[];
		$scope.weight=[];
		$scope.measurementItemArray=[];
		$scope.cDateMeasurement=[];
		$scope.measurement = [];

		
		$scope.measurement ={
			name:''
		}
		WeightWidgetService.initDB();
		MeasurementsWidgetService.initDB();
		fetchWeight();
		fetchBodyPart();
	}

	function initMethods(){
		$scope.fetchMeasurement = fetchMeasurement;
	}

//------------------------------------------------------------//
//--------------------WEIGHT GRAPH----------------------------//
//------------------------------------------------------------//

	function fetchWeight(){
		try{
			WeightWidgetService.getAllWeight()
			.then(function(response){

				$scope.cDateWeight=[];
				$scope.weight=[];
				//$scope.weightArray = [];
				if(response && response.rows && response.rows.length > 0)
				{
					
					for(var i=0;i<response.rows.length;i++)
					{	
						
						$scope.cDateWeight.push(
							response.rows.item(i).created_at
						);

						$scope.weight.push(
							response.rows.item(i).current_weight
						);
						
					}
					var weightChart = new Chart(ctx1, {
					  type: 'line',
					  data: {
					    labels:$scope.cDateWeight,
					    datasets: [{
					      label: 'weight',
					      data: $scope.weight,
					      backgroundColor: "rgba(153,255,51,0.6)"
					    }]
					  }
					});
				}else
				{
					console.log("No entries created till now.");
					$scope.weight=[];
					alert("There are no weight entries at the moment!");
				}
			},function(error){
				console.log("Error in getting response");
			});
		}catch(e)
		{
			console.log("Error in fetchWeight controller "+e.message);
		}
		
	}

	

//-------------------------------------------------------------//
//--------------------MEASUREMENT CHART------------------------//
//-------------------------------------------------------------//
	function fetchBodyPart(){
		try{
			MeasurementsWidgetService.getFilteredEntriesForArray()
			.then(function(response){

				$scope.measurementItemArray=[];

				if(response && response.rows && response.rows.length > 0)
				{
					
					for(var i=0;i<response.rows.length;i++)
					{
						$scope.measurementItemArray.push(
							response.rows.item(i).bodypart_name
						);

					}
					$scope.units=
						{
							option: $scope.measurementItemArray
						};
				}else
				{
					console.log("No entries created till now.");
					$scope.measurementItemArray=[];
					alert("There are no items at the moment, please add values to the Measurements Widget to draw the graph.");
				}
			},function(error){
				console.log("Error in getting response");
			});
		}catch(e)
		{
			console.log("Error in fetchMeasurement controller "+e.message);
		}
		
	}

	function fetchMeasurement(name){
		try{
			console.log(name);
			MeasurementsWidgetService.getSpecificEntry(name)
			.then(function(response){

				$scope.cDateMeasurement=[];
				$scope.measurement = [];
				$scope.measurement.name=name;
				if(response && response.rows && response.rows.length > 0)
				{
					
					for(var i=0;i<response.rows.length;i++)
					{
						$scope.cDateMeasurement.push(
							response.rows.item(i).created_at
						);
						$scope.measurement.push(
							response.rows.item(i).measurement
						);

					}
					var measurementChart = new Chart(ctx2, {
					  type: 'line',
					  data: {
					    labels:$scope.cDateMeasurement,
					    datasets: [{
					      label: $scope.measurement.name,
					      data: $scope.measurement,
					      backgroundColor: "rgba(153,255,51,0.6)"
					    }]
					  }
					});
				}else
				{
					console.log("No entries created till now.");
					$scope.cDateMeasurement=[];
					$scope.measurement = [];
				}
			},function(error){
				console.log("Error in getting response");
			});
		}catch(e)
		{
			console.log("Error in fetchMeasurement controller "+e.message);
		}
		
	}
	
	
}]);