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
      $scope.tempID =0;
      WeightWidgetService.initDB();
      getWeight();
      
    }

    function initMethods(){
      $scope.addWeight = addWeight;
      $scope.displayDate = displayDate;
      $scope.checkDate = checkDate;
    }

    $ionicModal.fromTemplateUrl('add-weight-modal.html',{
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
    });


    $scope.openModal = function(){   
        $scope.modal.show();
        displayDate();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function(){
      $scope.modal.remove();
    });

     function displayDate(){
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

    function getWeight(){
      try{
        WeightWidgetService.getAllWeight()
        .then(fetchSuccessCB,fetchErrorCB);
      }catch(e){
        alert("Error in fetch weight controller "+e.message);
      }
    }

    function checkDate(){
      try{
        if($scope.weightArray.length>0){
          for(var j= 0 ; j< $scope.weightArray.length; j++){
            if($scope.weightArray[j].cDate==$scope.cDate){
              $scope.tempID=$scope.weightArray[j].id;
              $scope.dateExist=true;
              console.log($scope.tempID+", "+$scope.dateExist);
              break;
            }
          }
        }
        
      }catch(e){
        alert("Error in check weight controller "+e.message);
      }
    }

    function addWeight(){
      try{
        if($scope.weight.current> 0 && $scope.dateExist==false){
      
          WeightWidgetService.addNewWeight($scope.cDate,$scope.weight.current,$scope.wUnit.name)
          .then(function(response){
            alert("New weight saved. "+$scope.weight.current+', '+$scope.dateExist);
            getWeight();
            closeModal();
          },function(error){
            alert("Error in adding new Weight");
          });
        }else if($scope.weight.current> 0 && $scope.dateExist==true){
          WeightWidgetService.updateWeight($scope.weight.current,$scope.tempID)
           .then(function(response){
            alert("Updated weight saved. "+$scope.weight.current+', '+$scope.dateExist);
            $scope.dateExist=false;
            getWeight();
            closeModal();
          },function(error){
            alert("Error in updating new Weight");
          });
        }else
        {
          alert('Empty input, '+$scope.weight.current+', '+$scope.dateExist);
        }
      }
      catch(e){
        alert("Error in add weight controller "+e.message);
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
              cWeight:response.rows.item(i).today_weight,
              wUnit:response.rows.item(i).weight_unit,
              cDate:response.rows.item(i).current_date
            });
          
          }
            $scope.weight.current = $scope.weightArray[lastId].cWeight;
            $scope.wUnit.name = $scope.weightArray[lastId].wUnit;
            alert($scope.weight.current+", "+$scope.wUnit.name)
        }else
        {
          $scope.message = "No Weight created till now.";
        }
      }catch(e){
        alert("Error in fetchSuccessCB controller "+e.message);
      }
      
    }

    function fetchErrorCB(error)
    {
      alert("Some error occurred in fetching Weight");
    }

  }]);

  