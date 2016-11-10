var profileDetailsModule = angular.module('ProfileDetails',['ngCordova','ionic','ionic-datepicker']);

profileDetailsModule.controller('ProfileDetailsCtrl', ['$scope','$cordovaSQLite', '$ionicPlatform','ionicDatePicker', 'ProfileService',
	function($scope, $cordovaSQLite, $ionicPlatform, ionicDatePicker, ProfileService){
	  
	  initData();
	  initMethods();
	  var todayDate = new Date(); //get today's date
	  var diffInDays = 0;

	  $scope.$watch('goalDate', function(newValue,oldValue){//watch goalDate model 
	      if(newValue != oldValue){							//if there is a change in value
	        $scope.weeklyWeightloss($scope.tWeight);		//calculate new weekly weight loss
	      }
	  });
	  $scope.$watch('tWeight', function(newValue,oldValue){ //watch tWeight model
	      if(newValue != oldValue){							//if changes
	        $scope.weeklyWeightloss(newValue);				//calculate new weekly weight loss
	      }
	  });

	    function initData(){
	  		$scope.units={
				option: [
				  {name: 'kg'},
				  {name: 'lbs'},
				  {name: 'stones'}
				]
			};
		 	$scope.wUnit = {
		 		name: 'kg'
		 	}; 
	  		$scope.tWeight = 0;
	  		$scope.weight={
	  			current:0,
	  			second:0
	  		};
	  		$scope.wwl=0;
	  		$scope.goalDate='';
	  		$scope.cDate = "";
	  		$scope.tempIDWeight = 0;
	  		$scope.tempIDProfile =0;
	  		$scope.dateExistWeight = false; //there is no entry for today in weight table
	  		$scope.dateExistProfileData = false; //no entry for today in profile data table
	  		$scope.ProfileDataList = []; //get profile data from db
	  		$scope.weightArray = []; //get weight from db
			$scope.loadingProfileData = false; //hide loader
			
			ProfileService.initDB();
			fetchWeight();
			fetchProfileData();
			currentDate();
		}

	 	function initMethods() {
			$scope.addNewProfileData = addNewProfileData;
			$scope.addNewWeight = addNewWeight;
			$scope.checkDateForProfile = checkDateForProfile;
			$scope.checkDateForWeight = checkDateForWeight;
		}

		$scope.calTotalWeight = function(a, b){  //function to calculate total weight to lose
		    if(a>0 && b >0){
		      $scope.tWeight = a- b;
		    }
		}

//---------------------------------------------------------------------------------//
//------------------------CHECK CURRENT DATE---------------------------------------//
//---------------------------------------------------------------------------------//

	function currentDate(){ //use to get a formated date value for today to be compared to with dates in the db
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

    function checkDateForProfile(){
        try{
         
          if($scope.ProfileDataList.length>0){
            for(var j= 0 ; j< $scope.ProfileDataList.length; j++){
              if($scope.ProfileDataList[j].cDate==$scope.cDate){
                $scope.tempIDProfile=$scope.ProfileDataList[j].id;
                $scope.dateExistProfileData=true;
                console.log($scope.tempIDProfile+", "+$scope.dateExistProfileData);  
                break;
              }
            }
          }
        }catch(e){
          console.log("Error in check weight controller "+e.message);
        }
    }

    function checkDateForWeight(){
        try{
         
          if($scope.weightArray.length>0){
			for(var k= 0 ; k< $scope.weightArray.length; k++){
			   if($scope.weightArray[k].cDate==$scope.cDate){
			      $scope.tempIDWeight=$scope.weightArray[k].id;
			      $scope.dateExistWeight=true;
			      console.log($scope.tempIDWeight+", "+$scope.dateExistWeight);
			      break;
			    }
			}
		  }
        }catch(e){
          console.log("Error in check weight controller "+e.message);
        }
    }

//---------------------------------------------------------------------------------//
//-------------------------------DATE PICKER---------------------------------------//
//---------------------------------------------------------------------------------//

		  var gDate = {
		    callback: function (val) {  //Mandatory
		      console.log('Return value from the datepicker popup is : ' + val, new Date(val));

		      var monthsList= ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
		      var dateToString = "";
		      var oneDay = 24*60*60*1000;
		      var newDate = new Date(val);
		      displayDate = function(){  //to display the goal date in a specific format
		        var i = new Date(val).getMonth();
		        var month = monthsList[i];
		        dateToString = new Date(val).getDate()+ " "+ month + " " + new Date(val).getFullYear();
		        $scope.goalDate =dateToString;   
		        console.log(dateToString);
		      }

		      numOfDays =function(){ //calculate the difference between today's date and the goal date
		        diffInDays = Math.round((newDate-todayDate)/(oneDay)+1);
		          console.log(diffInDays);
		      }

		      displayDate();
		   
		      $scope.weeklyWeightloss = function(c){
		        numOfDays();
		        if(diffInDays>0){
		          if(c>0){
		     
		            if(diffInDays>7){ //divide the different in days to weeks
		              var numOfWeeks = Math.round(diffInDays/7);
		              var num = c/numOfWeeks; //divide total weight to lose by the weeks
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

//---------------------------------------------------------------------------------//
//-------------------------PROFILE DATA FUNCTIONS----------------------------------//
//---------------------------------------------------------------------------------//	  

		function fetchProfileData() {
			$scope.loadingProfileData = true;
			try{
				ProfileService.getAllProfileData()
				.then(fetchProfileDataSuccessCB,fetchProfileDataErrorCB);
			}catch(e){
				console.log("Error in fetchProfileData controller "+e.message);
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
							cDate:response.rows.item(i).current_date,
							cWeight:response.rows.item(i).current_weight,
							wUnit:response.rows.item(i).weight_unit,
							gWeight:response.rows.item(i).goal_weight,
							goalDate:response.rows.item(i).goal_date,
							tWeight:response.rows.item(i).total_weight_loss,
							wwl:response.rows.item(i).weekly_weight_loss
						});
					
					}
						//display the latest entry in the html
						$scope.weight.second = $scope.ProfileDataList[lastId].gWeight;
						$scope.wUnit.name = $scope.ProfileDataList[lastId].wUnit;
						$scope.goalDate = $scope.ProfileDataList[lastId].goalDate;
						$scope.tWeight = $scope.ProfileDataList[lastId].tWeight;
						$scope.wwl = $scope.ProfileDataList[lastId].wwl;
						checkDateForProfile();

				}else
				{
					$scope.message = "No ProfileData created till now.";
				}
			}catch(e){
				console.log("Error in fetchProfileDataSuccessCB controller "+e.message);
			}
			
		}

		function fetchProfileDataErrorCB(error)
		{
			$scope.loadingProfileData = false;
			console.log("Some error occurred in fetching ProfileData");
		}

		function addNewProfileData() //if dateExistProfileData is false then add new entry else update
		{
			try{
				if($scope.weight.current> 0 && $scope.weight.second > 0 && $scope.goalDate!='' && $scope.dateExistProfileData==false){
					ProfileService.addNewProfileData($scope.cDate, $scope.weight.current, $scope.wUnit.name, $scope.weight.second, $scope.goalDate, $scope.tWeight, $scope.wwl)
					.then(function(response)
					{
						alert("Saved");
						fetchProfileData();
					},function(error)
					{
						console.log("Error in adding new ProfileData ");
					});
				}else if($scope.weight.current> 0 && $scope.weight.second > 0 && $scope.goalDate!='' && $scope.dateExistProfileData==true){
		          ProfileService.updateProfileData( $scope.weight.current, $scope.wUnit.name, $scope.weight.second, $scope.goalDate, $scope.tWeight, $scope.wwl, $scope.tempIDProfile)
		           .then(function(response)
		           {
		            $scope.dateExistProfileData=false;
		            alert("Updated");
		            fetchProfileData();
		          },function(error)
		          {
		            console.log("Error in updating new ProfileData");
		          });
		        }else
				{
					alert('Empty inputs!');
				}
			}
			catch(e){
				console.log("Error in addNewProfileData controller "+e.message);
			}
		}

//---------------------------------------------------------------------------------//
//-----------------------------WEIGHT FUNCTIONS------------------------------------//
//---------------------------------------------------------------------------------//		

	function fetchWeight(){
      try{
        ProfileService.getAllWeight()
        .then(fetchSuccessCB,fetchErrorCB);
      }catch(e){
        console.log("Error in fetch weight controller "+e.message);
      }
    }

    function fetchSuccessCB(response)
    {
      try{
        if(response && response.rows && response.rows.length > 0)
        {
          
          $scope.weightArray = [];
          var lastId= response.rows.length - 1;
          for(var i=0;i<response.rows.length;i++)
          {
            $scope.weightArray.push
            ({
              id:response.rows.item(i).id,
              cWeight:response.rows.item(i).current_weight,
              wUnit:response.rows.item(i).weight_unit,
              cDate:response.rows.item(i).current_date
            });
          
          }
          $scope.weight.current = $scope.weightArray[lastId].cWeight;
          checkDateForWeight();
        }else
        {
          $scope.message = "No Weight created till now.";
        }
      }catch(e){
        console.log("Error in fetchSuccessCB controller "+e.message);
      }
      
    }

    function fetchErrorCB(error)
    {
      console.log("Some error occurred in fetching Weight");
    }

    function addNewWeight(){ //if dateExistWeight is false then add new entry else update entry
      try{
        if($scope.weight.current> 0 && $scope.dateExistWeight==false)
        {
      
          ProfileService.addNewWeight($scope.cDate,$scope.weight.current,$scope.wUnit.name)
          .then(function(response)
          {
            console.log("New weight saved. "+$scope.weight.current+', '+$scope.dateExistWeight);
            fetchWeight();
          },function(error)
          {
            console.log("Error in adding new Weight");
          });
        }else if($scope.weight.current> 0 && $scope.dateExistWeight==true)
        {
          ProfileService.updateWeight($scope.weight.current, $scope.wUnit.name, $scope.tempIDWeight)
           .then(function(response)
           {
            console.log("Updated weight saved. "+$scope.weight.current+', '+$scope.dateExistWeight);
            $scope.dateExistWeight=false;
            fetchWeight();
          },function(error)
          {
            console.log("Error in updating new Weight");
          });
        }else
        {
          console.log('Empty input, '+$scope.weight.current+', '+$scope.dateExistWeight);
        }
      }
      catch(e){
        console.log("Error in add weight controller "+e.message);
      }
    }
		
}]); 

	