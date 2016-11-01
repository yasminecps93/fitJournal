var routineDetailsModule = angular.module('RoutineDetails',['ngCordova']);

routineDetailsModule.controller('RoutineDetailsCtrl',['$scope','$stateParams','$cordovaSQLite','$ionicPlatform','RoutineService','RoutinesService', '$ionicPopup',
	function($scope,$stateParams,$cordovaSQLite,$ionicPlatform,RoutineService,Routines,$ionicPopup){
		
		initData();
		initMethods();

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
		}

		function fetchEntries() {
			$scope.loadingEntries = true;
			RoutineService.getAllEntries($scope.routineId)
			.then(fetchEntriesSuccessCB,fetchEntriesErrorCB);
		}

		function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}

		function addNewEntry()
		{
			//try testing now
			try{
				if($scope.exeName.name!= '' && $scope.exeNumber.number!= ''&& $scope.exeSet.set!= ''){
				RoutineService.addNewEntry($scope.routineId,$scope.exeName.name,$scope.exeNumber.number,$scope.exeUnit.name,$scope.exeSet.set,$scope.exeCal.value)
				.then(function(response){
				//	$scope.newEntry.value = 0;
				//	alert("New Entry has been added.");
					fetchEntries();
				},function(error){
					alert("Error in adding new entry");
				});
				}else
					{
						alert('Please enter a positive value.');
					}
			}catch(e){
				alert("cannot enter addNewEntry function" + e.code +", "+e.message);
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
				//	alert("Entry has been succesfully deleted.");
				},function(error){
					alert("Error in adding new entry");
				});
			}
		}
}]);
