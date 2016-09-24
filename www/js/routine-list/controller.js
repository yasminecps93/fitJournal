var routinesListModule = angular.module('RoutinesList',['ngCordova']);

routinesListModule.controller('RoutinesListCtrl',['$scope','$cordovaSQLite','$ionicPlatform','RoutinesService',
	function($scope,$cordovaSQLite,$ionicPlatform,RoutinesService){

		initData();
		initMethods();

		function initData(){
			$scope.newRoutine = {
				name: ''
			};
			$scope.loadingRoutines = false;
			$scope.shouldShowDelete = false;
			$scope.editButtonLabel = "Edit";
			RoutinesService.initDB();
			fetchRoutines();
		}

		function initMethods() {
			$scope.addNewRoutine = addNewRoutine;
			$scope.toggleEdit = toggleEdit;
			$scope.deleteRoutine = deleteRoutine;
		}

		function fetchRoutines() {
			$scope.loadingRoutines = true;
			RoutinesService.getAllRoutines()
			.then(fetchRoutineListSuccessCB,fetchRoutineListErrorCB);
		}

		function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}

		function addNewRoutine()
		{

			if($scope.newRoutine.name != '' && $scope.newRoutine.name.length > 0){

				RoutinesService.addNewRoutine($scope.newRoutine.name)
				.then(function(response){
					$scope.newRoutine.name = '';
			//		alert("New Routine has been added.");
					fetchRoutines();
				},function(error){
					alert("Error in adding new routine");
				});
			}else
			{
				alert('Please enter the name of the routine.');
			}
		}

		function fetchRoutineListSuccessCB(response)
		{
			$scope.loadingRoutines = false;
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
				$scope.message = "No routines created till now.";
			}
		}

		function fetchRoutineListErrorCB(error)
		{
			$scope.loadingRoutines = false;
			$scope.message = "Some error occurred in fetching Routines List";
		}

		function deleteRoutine(index,id)
		{
			if(index > -1)
			{
				RoutinesService.deleteRoutine(id)
				.then(function(response){
					$scope.routinesList.splice(index,1);
			//		alert("Routine has been succesfully deleted.");
				},function(error){
					alert("Error in adding new routine");
				});
			}
		}
}]);
