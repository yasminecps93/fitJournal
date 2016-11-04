var cameraWidgetModule = angular.module('CameraWidget',['ngCordova','ionic']);

cameraWidgetModule.controller('CameraWidgetCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','CameraWidgetService','$ionicModal','$ionicPopup', '$cordovaCamera','$cordovaFile',
	function($scope,$state,$cordovaSQLite,$ionicPlatform, CameraWidgetService, $ionicModal,$ionicPopup,$cordovaCamera,$cordovaFile){
    
	    initData();
	    initMethods();

	    function initData(){
	    	$scope.cDate = "";
	    	$scope.dateExist = false;
	    	$scope.isExist = false;
	    	$scope.tempID = -1;
	    	$scope.imageArray = [];

        $scope.widget={
          header:""
        }
	    	$scope.image={
	    		file:"",
	    		caption:""
	    	}

	    	CameraWidgetService.initDB();
	    	currentDate();
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

    $ionicModal.fromTemplateUrl('add-image-modal.html',{
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
//---------------------------POPUP FUNCTIONS---------------------------------------//
//---------------------------------------------------------------------------------//


    $scope.showPopup = function(){
        $scope.data={}
        var entrypopup = $ionicPopup.show({
          templateUrl:'add-image-popup.html',
          title: 'Select',
          scope: $scope
        });
        $scope.closePopup = function(){
	        entrypopup.close();
	      }
      }

//---------------------------------------------------------------------------------//
//--------------------CHECK CURRENT DATE FUNCTIONS---------------------------------//
//---------------------------------------------------------------------------------//

     function currentDate(){

          var month = new Date().getMonth() + 1;
          var date = new Date().getDate();
          if(date<10){
          	$scope.cDate = new Date().getFullYear()+ "-"+ month + "-0" + new Date().getDate();
          }else{
          	$scope.cDate = new Date().getFullYear()+ "-"+ month + "-" + new Date().getDate(); 
          }
          fetchAllImage();
      }

//---------------------------------------------------------------------------------//
//----------------------------IMAGE FUNCTIONS--------------------------------------//
//---------------------------------------------------------------------------------//
	
	function fetchAllImage(){
		try{
        console.log("in fetchAllImage");
        CameraWidgetService.getAllEntry($scope.cDate)
        .then(fetchSuccessCB,fetchErrorCB);
      }catch(e){
        console.log("Error in fetch fetchAllImage controller "+e.message);
      }
	}

	 function fetchSuccessCB(response)
    {
      try{
        if(response && response.rows && response.rows.length > 0)
        {
          console.log("in response");
          $scope.imageArray = [];
       	  //var lastID = response.rows.length-1;
          for(var i=0;i<response.rows.length;i++)
          {
            $scope.imageArray.push
            ({
              id:response.rows.item(i).id,
              cDate:response.rows.item(i).created_at,
              widgetHeader:response.rows.item(i).widget_header,
              imageFile:response.rows.item(i).image_file,
              caption:response.rows.item(i).caption
            });
          }
          for(var j= 0;j<response.rows.length;j++){
            console.log(response.rows.item(j).widget_header);
          	if($scope.widget.header == response.rows.item(j).widget_header){
          		$scope.tempID = response.rows.item(j).id;
          		$scope.image.file = response.rows.item(j).image_file;        
          		$scope.image.caption = response.rows.item(j).caption;
          		$scope.isExist=true;
          		break;
          	}
          }
          
          $scope.dateExist = true;
        }else
        {
          console.log("No images created for today till now.");
          $scope.dateExist = false;
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
    		if($scope.dateExist==true){
    			if($scope.isExist == true){
	    			updateEntry();
	    			$scope.isExist = false;
	    			$scope.dateExist = false;
	    		}else{
	    			addNewEntry();
	    			$scope.dateExist = false;
	    		}
    		}else{
    			addNewEntry();
    		}
    		
    	}catch(e){
        	 console.log("Error in checkForExisting controller "+e.message);
    	}
    }

    function addNewEntry(){
    	try{
    		if($scope.image.file != ''){
    			CameraWidgetService.addNewImage($scope.widget.header,$scope.image.file,$scope.image.caption)
	    		.then(function(response){
	    			alert("Saved");
	    			fetchAllImage();
	    			$scope.closeModal();
	    		},function(error){
	    			console.log("addNewEntry error");
	    		});
    		}else{
    			console.log("Image file string is empty");
    		}
    		
    	}catch(e){
          console.log("Error in addNewEntry controller "+e.message);
    	}
    }

    function updateEntry(){
    	try{
    		console.log("updateEntry  "+$scope.tempID);
    		if($scope.image.file != ''){
    			CameraWidgetService.updateEntry($scope.image.file,$scope.image.caption,$scope.tempID)
	    		.then(function(response){
	    			alert("Updated");
	    			fetchAllImage();
	    			$scope.closeModal();
	    		},function(error){
	    			console.log("updateEntry error");
	    		});
    		}else{
    			console.log("Image file string is empty");
    		}
    		
    	}catch(e){
          console.log("Error in updateEntry controller "+e.message);
    	}
    }

     function deleteEntry(name){
      try{
        CameraWidgetService.deleteEntry(name)
        .then(function(response){
          fetchAllImage();
        },function(error){
          console.log("deleteEntry error");
        });
      }catch(e){
        console.log("Error in deleteEntry controller "+e.message);
      }

    }

//---------------------------------------------------------------------------------//
//---------------------------------CAMERA FUNCTIONS--------------------------------//
//---------------------------------------------------------------------------------//
	$scope.takePhoto = function () {
        var options = {
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: true
        };
   
		$cordovaCamera.getPicture(options).then(function (imageURI) {
            $scope.image.file = imageURI;
        //   	alert("$scope.image.file----"+$scope.image.file);
            $scope.openModal();
        }, function (err) {
            console.log("Error in getPicture of takePhoto");
        });
    }

    $scope.choosePhoto = function () {
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
            };
   
            $cordovaCamera.getPicture(options).then(function (imageURI) {
              //  $scope.imgURI = imageData;
                $scope.image.file = imageURI;
           //     alert("$scope.image.file----"+$scope.image.file);
                $scope.openModal();
             }, function (err) {
             	console.log("Error in getPicture of choosePhoto");
            });
    }

}]);