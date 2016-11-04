var customWidgetModule = angular.module('CustomWidget',['ngCordova','ionic']);

customWidgetModule.controller('CustomWidgetCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','CustomWidgetService','$ionicModal',
	function($scope,$state,$cordovaSQLite,$ionicPlatform, CustomWidgetService, $ionicModal){
    
	    initData();
	    initMethods();

	    function initData(){
	    	$scope.isExist = false;
	    	$scope.tempID = -1;
	    	$scope.customArray = [];

	    	$scope.widget={
	    		header:"",
	    		text:""
	    	}

	    	CustomWidgetService.initDB();
	    	fetchAllEntry();
	    }

	    function initMethods(){
	    	//$scope.checkDate = checkDate;
	    	$scope.checkForExisting = checkForExisting;
	    	$scope.addNewEntry = addNewEntry;
	    	$scope.updateEntry = updateEntry;
	    	$scope.deleteEntry = deleteEntry;
	    }

	    $scope.getTitle = function(name)
  		{
  			$scope.widget.header = name;
  			console.log("widget header---"+$scope.widget.header);
  		}

//---------------------------------------------------------------------------------//
//---------------------------MODAL FUNCTIONS---------------------------------------//
//---------------------------------------------------------------------------------//

    $ionicModal.fromTemplateUrl('add-text-modal.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
    });


    $scope.openModal = function(){   
        $scope.modal.show();
      //  checkDate();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function(){
      $scope.modal.remove();
    });

//---------------------------------------------------------------------------------//
//----------------------------GET ARRAY FUNCTIONS----------------------------------//
//---------------------------------------------------------------------------------//
	
	function fetchAllEntry(){
		try{
        CustomWidgetService.getAllEntry()
        .then(fetchSuccessCB,fetchErrorCB);
      }catch(e){
        console.log("Error in fetch fetchAll controller "+e.message);
      }
	}

	 function fetchSuccessCB(response)
    {
      try{
        if(response && response.rows && response.rows.length > 0)
        {
          
          $scope.customArray = [];
       	 
          for(var i=0;i<response.rows.length;i++)
          {
            $scope.customArray.push
            ({
              id:response.rows.item(i).id,
              header:response.rows.item(i).header,
              text:response.rows.item(i).text
            });
          }
          for(var j= 0;j<response.rows.length;j++){
          	if($scope.widget.header == response.rows.item(j).header){
          		$scope.tempID = response.rows.item(j).id;     
          		$scope.widget.text = response.rows.item(j).text;
          		$scope.isExist=true;
          		break;
          	}
          }
          
        }else
        {
          	console.log("No images created for today till now.");
        	$scope.customArray = [];
        }
      }catch(e){
        console.log("Error in fetchSuccessCB controller "+e.message);
      }
      
    }

    function fetchErrorCB(error)
    {
      console.log("Some error occurred in fetchErrorCB");
    }

    function checkForExisting(){
    	try{
    		console.log("$scope.dateExist = "+$scope.dateExist+", $scope.isExist = "+$scope.isExist);
    			if($scope.isExist == true){
	    			updateEntry();
	    			$scope.isExist = false;
	    		}else{
	    			addNewEntry();
	    		}
    	}catch(e){
        	 console.log("Error in checkForExisting controller "+e.message);
    	}
    }

    function addNewEntry(){
    	try{
    		if($scope.widget.header != ''){
    			CustomWidgetService.addNewEntry($scope.widget.header,$scope.widget.text)
	    		.then(function(response){
	    			alert("Saved");
	    			fetchAllEntry();
	    		},function(error){
	    			console.log("addNewEntry error");
	    		});
    		}else{
    			console.log("Header is empty");
    		}
    		
    	}catch(e){
          console.log("Error in addNewEntry controller "+e.message);
    	}
    }

    function updateEntry(){
    	try{
    		console.log("updateEntry  "+$scope.tempID);
    		if($scope.widget.header != ''){
    			CustomWidgetService.updateEntry($scope.widget.text,$scope.tempID)
	    		.then(function(response){
	    			alert("Updated");
	    			fetchAllEntry();
	    		},function(error){
	    			console.log("updateEntry error");
	    		});
    		}else{
    			console.log("Header is empty");
    		}
    		
    	}catch(e){
          console.log("Error in updateEntry controller "+e.message);
    	}
    }

    function deleteEntry(name){
    	try{
    		CustomWidgetService.deleteEntry(name)
	    	.then(function(response){
	    		fetchAllEntry();
	    	},function(error){
	    		console.log("deleteEntry error");
	    	});
    	}catch(e){
    		console.log("Error in deleteEntry controller "+e.message);
    	}

    }

}]);