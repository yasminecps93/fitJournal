var profileDetailsModule = angular.module('ProfileDetails',['ngCordova','ionic','ionic-datepicker']);

profileDetailsModule.controller('ProfileDetailsCtrl', ['$scope','$cordovaSQLite', '$ionicPlatform','ionicDatePicker', 'ProfileService',
	function($scope, $cordovaSQLite, $ionicPlatform, ionicDatePicker, ProfileService){
	  
	  initData();
	  initMethods();

	  function initData(){
	  		$scope.units={
				option: [
				  {name: 'kg'},
				  {name: 'lbs'}
				]
			};
		 	$scope.wUnit = {
		 		name: 'kg'
		 	}; 
	  		$scope.tWeight = 0;
	  		$scope.weight={
	  			first:0,
	  			second:0
	  		};
	  		$scope.wwl=0;
	  		$scope.goalDate='';
	  		$scope.cDate = "";
			$scope.loadingProfileData = false;
			
			ProfileService.initDB();
			fetchProfileData();
			currentDate();
		}

	 
	  var todayDate = new Date();
	  var diffInDays = 0;
/*	  $scope.items=[{
	    wUnit: "kg"
	  }, {
	    wUnit: "lbs"
	  },];*/

	  $scope.$watch('tWeight', function(newValue,oldValue){
	      if(newValue != oldValue){
	        $scope.weeklyWeightloss(newValue);
	      }
	  });

	  $scope.calTotalWeight = function(a, b){

	    if(a>0 && b >0){
	      $scope.tWeight = a- b;
	    }
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
	        $scope.goalDate =dateToString;   
	        console.log(dateToString);
	      }

	      numOfDays =function(){
	        diffInDays = Math.round((newDate-todayDate)/(oneDay)+1);
	        /*  console.log(newDate);
	          console.log(todayDate);*/
	          console.log(diffInDays);
	       //   $scope.totalDaysForPreviousGoalDate = diffInDays;
	      }

	      displayDate();
	   
	      $scope.weeklyWeightloss = function(c){
	        numOfDays();
	        if(diffInDays>0){
	          if(c>0){
	     
	            if(diffInDays>7){
	              var numOfWeeks = Math.round(diffInDays/7);
	              var num = c/numOfWeeks;
	              $scope.wwl = num.toFixed(1);
	            }else{
	              $scope.wwl = $scope.tWeight;
	            }
	          }
	        }
	      }
	    }
	  };
	   
	  $scope.openDatePicker = function(){
	      ionicDatePicker.openDatePicker(gDate);
	  };

	  

		function initMethods() {
			$scope.addNewProfileData = addNewProfileData;
			$scope.deleteEntry = deleteEntry;
			$scope.addNewWeight = addNewWeight;
			$scope.currentDate = currentDate;
		}

		function currentDate(){
          var monthsList= ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
          var dateToString = "";
          var oneDay = 24*60*60*1000;
          var todayDate = new Date();
          var i = new Date().getMonth();
          var month = monthsList[i];
          dateToString = new Date().getDate()+ "/"+ month + "/" + new Date().getFullYear();
          $scope.cDate =dateToString;   
          console.log(dateToString);
      }

		function fetchProfileData() {
			$scope.loadingProfileData = true;
			try{
				ProfileService.getAllProfileData()
				.then(fetchProfileDataSuccessCB,fetchProfileDataErrorCB);
			}catch(e){
				alert("Error in fetchProfileData controller "+e.message);
			}
			
		}

		function addNewProfileData()
		{
			try{
				if($scope.weight.first> 0 && $scope.weight.second > 0 && $scope.goalDate!=''){
			//	deleteEntry();
				ProfileService.addNewProfileData($scope.weight.first,$scope.wUnit.name, $scope.weight.second, $scope.goalDate, $scope.tWeight, $scope.wwl)
				.then(function(response){
				//	$scope.newProfileData.name = '';
				//	alert("New ProfileData has been added. "+$scope.weight.first+", "+$scope.weight.second+", "+$scope.goalDate+", "+$scope.tWeight+", "+$scope.wwl);
					fetchProfileData();
				},function(error){
					alert("Error in adding new ProfileData ");
				});
				}else
				{
					alert('Some are empty. ');
				}
			}
			catch(e){
				alert("Error in addNewProfileData controller "+e.message);
			}
		}

		function addNewWeight(){
			try{
				if($scope.weight.first> 0 && $scope.weight.second > 0 && $scope.goalDate!=''){
				ProfileService.addNewWeight($scope.cDate, $scope.weight.first,$scope.wUnit.name)
				.then(function(response){
					
					//fetchProfileData();
				},function(error){
					alert("Error in adding new weight ");
				});
				}else
				{
					alert('Please enter the name of the weight. ');
				}
			}
			catch(e){
				alert("Error in addNewWeight controller "+e.message);
			}
		}

		function fetchProfileDataSuccessCB(response)
		{
			$scope.loadingProfileData = false;

			try{
				if(response && response.rows && response.rows.length > 0)
				{
					
					$scope.ProfileDataList = [];
					var lastId= response.rows.length - 1;
					for(var i=0;i<response.rows.length;i++)
					{
						$scope.ProfileDataList.push
						({
							id:response.rows.item(i).id,
							cWeight:response.rows.item(i).current_weight,
							wUnit:response.rows.item(i).weight_unit,
							gWeight:response.rows.item(i).goal_weight,
							goalDate:response.rows.item(i).goal_date,
							tWeight:response.rows.item(i).total_weight_loss,
							wwl:response.rows.item(i).weekly_weight_loss
						//	totalDaysForPreviousGoalDate:response.rows.item(i).diffInDays
						});
					
					}
						$scope.weight.first = $scope.ProfileDataList[lastId].cWeight;
						$scope.weight.second = $scope.ProfileDataList[lastId].gWeight;
						$scope.wUnit.name = $scope.ProfileDataList[lastId].wUnit;
						$scope.goalDate = $scope.ProfileDataList[lastId].goalDate;
						$scope.tWeight = $scope.ProfileDataList[lastId].tWeight;
						$scope.wwl = $scope.ProfileDataList[lastId].wwl;
					//	$scope.totalDaysForPreviousGoalDate =  $scope.ProfileDataList[lastId].totalDaysForPreviousGoalDate;
				}else
				{
					$scope.message = "No ProfileData created till now.";
				}
			}catch(e){
				alert("Error in fetchProfileDataSuccessCB controller "+e.message);
			}
			
		}

		function fetchProfileDataErrorCB(error)
		{
			$scope.loadingProfileData = false;
			alert("Some error occurred in fetching ProfileData");
		}

		function deleteEntry(index)
		{
			try{
					ProfileService.deleteEntry()
					.then(function(response){
					//	$scope.entriesList.splice(index,1);
					//	alert("Entry has been succesfully deleted.");
					},function(error){
						alert("Error in adding new entry");
					});

				
			}catch(e){
				alert("Error in deleteEntry controller "+e.message);
			}
			
		}
		
	}
]); 
	