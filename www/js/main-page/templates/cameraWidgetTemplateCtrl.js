var cameraWidgetModule = angular.module('CameraWidget',['ngCordova','ionic']);

cameraWidgetModule.controller('CameraWidgetCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','CameraWidgetService','$ionicModal','$ionicPopup', '$cordovaCamera','$cordovaFile',
	function($scope,$state,$cordovaSQLite,$ionicPlatform, CameraWidgetService, $ionicModal,$ionicPopup,$cordovaCamera,$cordovaFile){
    
	    initData();
	    initMethods();

	    function initData(){
	    	$scope.cDate = "";
	    	$scope.dateExist = false;
	    	$scope.isExist = false;
	    	$scope.tempID = 0;
	    	$scope.imageArray = [];
	    	$scope.image={
	    		file:"",
	    		caption:""
	    	}
	    	$scope.widgetID = 0;

	    	CameraWidgetService.initDB();
	    	fetchAllImage();
	    	currentDate();
	    }

	    function initMethods(){
	    	$scope.checkDate = checkDate;
	    	$scope.checkForExisting = checkForExisting;
	    	$scope.addNewEntry = addNewEntry;
	    	$scope.updateEntry = updateEntry;
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
        checkDate();
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
          
      }

      function checkDate(){
        try{
         if($scope.imageArray.length>0){
         	var lastID = $scope.imageArray.length - 1;

         	if($scope.cDate == $scope.imageArray[lastID].cDate){
         		$scope.dateExist = true;
         		alert($scope.cDate+" == "+$scope.imageArray[lastID].cDate);
         	}else{
         		$scope.dateExist = false;
         		alert($scope.cDate+" != "+$scope.imageArray[lastID].cDate);
         	}
         }
         
        }catch(e){
          alert("Error in check date controller "+e.message);
        }
      }

//---------------------------------------------------------------------------------//
//----------------------------IMAGE FUNCTIONS--------------------------------------//
//---------------------------------------------------------------------------------//
	
	function fetchAllImage(){
		try{
        CameraWidgetService.getAllEntry()
        .then(fetchSuccessCB,fetchErrorCB);
      }catch(e){
        alert("Error in fetch fetchAllImage controller "+e.message);
      }
	}

	 function fetchSuccessCB(response)
    {
      try{
        if(response && response.rows && response.rows.length > 0)
        {
          
          $scope.imageArray = [];
       	  var lastID = response.rows.length-1;
          for(var i=0;i<response.rows.length;i++)
          {
            $scope.imageArray.push
            ({
              id:response.rows.item(i).id,
              cDate:response.rows.item(i).created_at,
              widgetID:response.rows.item(i).widget_id,
              imageFile:response.rows.item(i).image_file,
              caption:response.rows.item(i).caption
            });
          }
          $scope.image.file = response.rows.item(lastID).image_file;        
          $scope.image.caption = response.rows.item(lastID).caption;
        }else
        {
          alert("No images created till now.");
        }
      }catch(e){
        alert("Error in fetchSuccessCB controller "+e.message);
      }
      
    }

    function fetchErrorCB(error)
    {
      alert("Some error occurred in fetchErrorCB");
    }

    function checkForExisting(){
    	try{
    		if($scope.dateExist==true){
    			for(var i=0; i<$scope.imageArray.length; i++){
    				if($scope.cDate == $scope.imageArray[i].cDate && $scope.widgetID == $scope.imageArray[i].widgetID){
    					$scope.tempID = $scope.imageArray[i].id;
    					$scope.isExist = true;
    					break;
    				}
    			}
    			if($scope.isExist == true){
	    			updateEntry();
	    			$scope.isExist = false;
	    			$scope.dateExist = false;
	    		}else{
	    			addNewEntry();
	    			$scope.dateExist = false;
    		}else{
    			addNewEntry();
    		}
    		
    	}catch(e){
        	 alert("Error in checkForExisting controller "+e.message);
    	}
    }

    function addNewEntry(){
    	try{
    		if($scope.image.file != ''){
    			CameraWidgetService.addNewImage($scope.widgetID,$scope.image.file,$scope.image.caption)
	    		.then(function(response){
	    			alert("saved ---- "+$scope.image.file);
	    			fetchAllImage();
	    			$scope.closeModal();
	    		},function(error){
	    			alert("addNewEntry error");
	    		});
    		}else{
    			alert("Image file string is empty");
    		}
    		
    	}catch(e){
          alert("Error in addNewEntry controller "+e.message);
    	}
    }

    function updateEntry(){
    	try{
    		if($scope.image.file != ''){
    			CameraWidgetService.updateEntry($scope.image.file,$scope.image.caption,$scope.tempID)
	    		.then(function(response){
	    			alert("updated ---- "+$scope.image.file);
	    			fetchAllImage();
	    			$scope.closeModal();
	    		},function(error){
	    			alert("updateEntry error");
	    		});
    		}else{
    			alert("Image file string is empty");
    		}
    		
    	}catch(e){
          alert("Error in updateEntry controller "+e.message);
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
   
		$cordovaCamera.getPicture(options).then(function (imagePath) {
            $scope.image.file = imagePath;
           	alert("$scope.image.file----"+$scope.image.file);
            $scope.openModal();
        }, function (err) {
            alert("Error in getPicture of takePhoto");
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
                alert("$scope.image.file----"+$scope.image.file);
                $scope.openModal();
             }, function (err) {
             	alert("Error in getPicture of choosePhoto");
            });
    }

}]);