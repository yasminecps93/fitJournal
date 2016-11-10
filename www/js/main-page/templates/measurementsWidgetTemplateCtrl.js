var measurementsWidgetModule = angular.module('MeasurementsWidget',['ngCordova','ionic']);

measurementsWidgetModule.controller('MeasurementsWidgetCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','MeasurementsWidgetService','$ionicModal','$ionicPopup',
	function($scope,$state,$cordovaSQLite,$ionicPlatform, MeasurementsWidgetService, $ionicModal,$ionicPopup){
    
	    initData();
	    initMethods();
    	
    	function initData(){
    		$scope.cDate = "";
		    $scope.dateExist = false;
        $scope.nameChange = false;
        $scope.nameAvailable = true;
		    $scope.tempIDMeasurements =0;
    		$scope.bodyPartMeasurementArray =[]; 
  
        $scope.newValue = {
          name: ""
        };

    		$scope.shouldShowDelete = false;
			  $scope.editButtonLabel = "Edit";
        $scope.bodypart = {
          name : ''
        }
        $scope.bp = {
          name : ''
        }
        $scope.units={
          option: [
            {name: 'cm'},
            {name: 'mm'},
            {name: 'inch'},
            {name: ''}
          ]
        };
        $scope.mUnit = {
          name: 'cm'
        };
        $scope.measurement = {
          num: 0
        };
			  
    		MeasurementsWidgetService.initDB();
    	  fetchAllBodyPartMeasurements();
       // fetchAll();
    	}

    	function initMethods(){
    		$scope.toggleEdit = toggleEdit;
        $scope.currentDate = currentDate;
        $scope.checkDate = checkDate;
        $scope.addNewBodyPart = addNewBodyPart;
        $scope.addNewEntry = addNewEntry;
        $scope.deleteBodyPartMeasurements = deleteBodyPartMeasurements;
      }

    function toggleEdit() {
			$scope.shouldShowDelete = !$scope.shouldShowDelete;
			$scope.editButtonLabel = $scope.shouldShowDelete ? "Done" : "Edit";
		}

		$scope.$watch('bp.name', function(newValue,oldValue){
      console.log("watching~~~~~");
	      if(newValue != oldValue){
          $scope.newValue.name = newValue;
          $scope.nameChange = true;
          console.log("nameChange "+$scope.nameChange+", newValue = "+$scope.newValue.name);
	      }
	  });

    $scope.addArray = function($index){
        $scope.tempArray = [];
        $scope.tempArray.push({
          name:$scope.bodyPartMeasurementArray[$index].bodypart_name,
          measurement:$scope.bodyPartMeasurementArray[$index].measurement,
          unit:$scope.bodyPartMeasurementArray[$index].unit
        });
        $scope.mUnit.name = $scope.tempArray[0].unit;
        $scope.measurement.num = $scope.tempArray[0].measurement;
      }


//---------------------------------------------------------------------------------//
//---------------------------MODAL FUNCTIONS---------------------------------------//
//---------------------------------------------------------------------------------//

    $ionicModal.fromTemplateUrl('add-measurements-modal.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
    });


    $scope.openModal = function(){   
        $scope.modal.show();
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
          templateUrl:'add-measurements-popup.html',
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
        }).then(function(res){
          //success

          console.log("Success");
        },function(err){
          //error
          console.log("Error");
        });
      }

      $scope.closePopup = function(){
        entrypopup.close();
        fetchAllBodyPartMeasurements();
      }

       $scope.showNamePopup = function(){
        $scope.data={}
        var popup = $ionicPopup.show({
          templateUrl:'add-name-popup.html',
          title: 'Enter item name',
          scope: $scope,
          buttons:[
          {
            text: 'Cancel', onTap:
            function(e){ return true;}
          },{
            text:'Save',
            type:'button-positive',
            onTap:function(e){
              addNewBodyPart();
            }
          }
          ]
        });
        $scope.closeNamePopup = function(){
          popup.close();
        }
      }

      $scope.showConfirm = function(index,name) {
         var confirmPopup = $ionicPopup.confirm({
           title: 'Alert',
           template: 'Are you sure you want to delete this item?'
         });

         confirmPopup.then(function(res) {
           if(res) {
             deleteBodyPartMeasurements(index,name);
           } else {
             console.log('You are not sure');
           }
         });
       };
      
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

      function checkDate(index){
        try{
          currentDate();
          if($scope.cDate != ''){
             if($scope.bodyPartMeasurementArray[index].cDate==$scope.cDate){
              $scope.tempIDMeasurements = $scope.bodyPartMeasurementArray[index].id;
              $scope.dateExist = true;
              console.log("dateExist "+$scope.dateExist);
            }else{
              console.log($scope.bodyPartMeasurementArray[index].cDate+" != "+$scope.cDate);
            }
          
          }
         
        }catch(e){
          console.log("Error in check date controller "+e.message);
        }
      }

      
//---------------------------------------------------------------------------------//
//-------------------------BODY PART FUNCTIONS-------------------------------------//
//---------------------------------------------------------------------------------//
	function fetchAllBodyPartMeasurements(){
      try{
        MeasurementsWidgetService.getAllBodyPartMeasurements()
        .then(fetchBodyPartSuccessCB,fetchBodyPartErrorCB);
      }catch(e){
        console.log("Error in fetch AllBodyPartMeasurements controller "+e.message);
      }
    }

    function fetchBodyPartSuccessCB(response)
    {
      try{
        if(response && response.rows && response.rows.length > 0)
        {
          
          $scope.bodyPartMeasurementArray = [];
       
          for(var i=0;i<response.rows.length;i++)
          {
            $scope.bodyPartMeasurementArray.push
            ({
              id:response.rows.item(i).id,
              bodypart_name:response.rows.item(i).bodypart_name,
              cDate:response.rows.item(i).created_at,
              measurement:response.rows.item(i).measurement,
              unit:response.rows.item(i).unit
            });
            console.log("~~~~"+$scope.bodyPartMeasurementArray[i].id+", "+$scope.bodyPartMeasurementArray[i].bodypart_name+", "+$scope.bodyPartMeasurementArray[i].cDate+", "+$scope.bodyPartMeasurementArray[i].measurement+", "+$scope.bodyPartMeasurementArray[i].unit)

          }
          
        }else
        {
          console.log("No body parts created till now.");
          $scope.bodyPartMeasurementArray =[]; 
        }
      }catch(e){
        console.log("Error in fetchBodyPartSuccessCB controller "+e.message);
      }
      
    }

    function fetchBodyPartErrorCB(error)
    {
      console.log("Some error occurred in fetchBodyPartErrorCB");
    }

    function addNewBodyPart()
    {
      try{
        $scope.nameAvailable = true;
        $scope.mUnit = {
          name: 'cm'
        };
        $scope.measurement = {
          num: 0
        };
        if($scope.bodypart.name != '')
        {
          if($scope.bodyPartMeasurementArray.length>0){
            for(var i=0; i<$scope.bodyPartMeasurementArray.length; i++){
              if($scope.bodypart.name == $scope.bodyPartMeasurementArray[i].bodypart_name){
                alert("Name already exist!");
                $scope.nameAvailable = false;
                break;
              }
            }
          }
          if ($scope.nameAvailable == true){
            MeasurementsWidgetService.addNewEntry($scope.bodypart.name, $scope.measurement.num, $scope.mUnit.name)
            .then(function(response){
              $scope.bodypart.name = "";
              alert("Saved");
              fetchAllBodyPartMeasurements(); 
            },function(error){
              console.log("Error in adding new BodyPart");
            });
          } 
        }else
        {
          alert('Empty inputs!');
        }
      }catch(e){
        console.log("Error in addNewBodyPart controller "+e.message);
      }
      
    }

    function addNewEntry(){
      try{
        if($scope.nameChange==true){
          if($scope.dateExist==true){
            console.log("nameChange = true, dateExist = true");
            MeasurementsWidgetService.updateEntry($scope.measurement.num, $scope.mUnit.name, $scope.tempIDMeasurements)
            .then(function(response){
              alert("Updated");
              $scope.dateExist = false;

              MeasurementsWidgetService.updateBodyPartName($scope.newValue.name, $scope.tempArray[0].name)
              .then(function(response){
                alert("Updated");
               fetchAllBodyPartMeasurements();
              },function(error){
                console.log("Error in updateBodyPartName--254");
              });

            },function(error){
              console.log("Error in updateEntry--258");
            });
          }else{
            console.log("nameChange = true, dateExist = false");
            MeasurementsWidgetService.addNewEntry($scope.newValue.name, $scope.measurement.num, $scope.mUnit.name)
            .then(function(response){
              alert("Saved");

              MeasurementsWidgetService.updateBodyPartName($scope.newValue.name, $scope.tempArray[0].name)
              .then(function(response){
                alert("Updated");
                fetchAllBodyPartMeasurements();
              },function(error){
                console.log("Error in updateBodyPartName--270");
              });

            },function(error){
              console.log("Error in addNewEntry--274");
            });
          }
          $scope.nameChange = false;
        }else{
          if($scope.dateExist==true){
            console.log("nameChange = false, dateExist = true");
            MeasurementsWidgetService.updateEntry($scope.measurement.num, $scope.mUnit.name, $scope.tempIDMeasurements)
            .then(function(response){
              alert("Updated");
              $scope.dateExist = false;
              fetchAllBodyPartMeasurements();
            },function(error){
              console.log("Error in updateEntry--286");
            });
          }else{
            console.log("nameChange = false, dateExist = false");
            MeasurementsWidgetService.addNewEntry($scope.tempArray[0].name, $scope.measurement.num, $scope.mUnit.name)
            .then(function(response){
              alert("Saved");
             fetchAllBodyPartMeasurements();
            },function(error){
              console.log("Error in addNewEntry--294");
            });
          }
        }
       
      }catch(e){
        console.log("Error in addNewEntry controller "+e.message);
      }
    }

    function deleteBodyPartMeasurements(index,bodypart_name){
      try{
        if(index>-1){
          MeasurementsWidgetService.deleteBodyPartMeasurements(bodypart_name)
          .then(function(response){
            console.log("Delete body part successful");
            fetchAllBodyPartMeasurements();
          },function(error){
            console.log("Error in deleting body part");
          });
        }
      }catch(e){
        console.log("Error in deleteBodyPart controller "+e.message);
      }
      
    }


}]);
