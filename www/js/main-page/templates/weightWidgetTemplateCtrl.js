var weightWidgetModule = angular.module('WeightWidget',['ngCordova','ionic']);

weightWidgetModule.controller('WeightWidgetCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','WeightWidgetService','$ionicModal',
  function($scope,$state,$cordovaSQLite,$ionicPlatform, WeightWidgetService, $ionicModal){
    
    initData();
    initMethods();
    
    function initData(){
      $scope.weightArray = [];
      $scope.weight={
          current:0
        };
      $scope.wUnit = {
        name: 'kg'
      }; 
      $scope.cDate = "";
      $scope.dateExist = false;
      $scope.tempIDWeight =0;
      WeightWidgetService.initDB();
      fetchWeight();
      
    }

    function initMethods(){
      $scope.addNewWeight = addNewWeight;
      $scope.currentDate = currentDate;
      $scope.checkDate = checkDate;
    }

//---------------------------------------------------------------------------------//
//---------------------------MODAL FUNCTIONS---------------------------------------//
//---------------------------------------------------------------------------------//

    $ionicModal.fromTemplateUrl('add-weight-modal.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
    });


    $scope.openModal = function(){   
        $scope.modal.show();
        currentDate();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
      fetchWeight();
    };

    $scope.$on('$destroy', function(){
      $scope.modal.remove();
    });

//---------------------------------------------------------------------------------//
//--------------------CHECK CURRENT DATE FUNCTIONS---------------------------------//
//---------------------------------------------------------------------------------//

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
          checkDate();
      }

      function checkDate(){
        try{
          if($scope.weightArray.length>0){
            for(var j= 0 ; j< $scope.weightArray.length; j++){
              if($scope.weightArray[j].cDate==$scope.cDate){
                $scope.tempIDWeight=$scope.weightArray[j].id;
                $scope.dateExist=true;
                console.log($scope.tempIDWeight+", "+$scope.dateExist);
                break;
              }
            }
          }
          
        }catch(e){
          console.log("Error in check date controller "+e.message);
        }
      }

//---------------------------------------------------------------------------------//
//--------------------------------WEIGHT FUNCTIONS---------------------------------//
//---------------------------------------------------------------------------------//      

    function fetchWeight(){
      try{
        WeightWidgetService.getAllWeight()
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
            $scope.wUnit.name = $scope.weightArray[lastId].wUnit;
            console.log($scope.weight.current+", "+$scope.wUnit.name)
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

    function addNewWeight(){
      try{
        if($scope.weight.current> 0 && $scope.dateExist==false){
      
          WeightWidgetService.addNewWeight($scope.cDate,$scope.weight.current,$scope.wUnit.name)
          .then(function(response){
            alert("Saved");
            fetchWeight();
            $scope.closeModal();
          },function(error){
            console.log("Error in adding new Weight");
          });
        }else if($scope.weight.current> 0 && $scope.dateExist==true){
          WeightWidgetService.updateWeight($scope.weight.current,$scope.tempIDWeight)
           .then(function(response){
            alert("Updated");
            $scope.dateExist=false;
            fetchWeight();
            $scope.closeModal();
          },function(error){
            console.log("Error in updating new Weight");
          });
        }else
        {
          console.log('Empty input, '+$scope.weight.current+', '+$scope.dateExist);
        }
      }
      catch(e){
        console.log("Error in add weight controller "+e.message);
      }
    }

    

  }]);

  