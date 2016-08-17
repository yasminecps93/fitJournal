
angular.module('myApp', ['ionic', 'ionic-datepicker'])

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('main-page',{
      url:'/main', 
      templateUrl: 'main-page.html'
  })
  .state('bottom-nav',{
    parent: 'main-page',
    url:'/', templateUrl: 'bottom-nav.html',
    controller:'SlideboxCtrl'
  })
  .state('profile',{
   url:'/profile',
   templateUrl:'templates/profile-details.html',
   controller:'ProfileCtrl'
});
  $urlRouterProvider.otherwise('/profile');
})

.config(function (ionicDatePickerProvider) {
    var datePickerObj = {
    inputDate: new Date(),
    setLabel: 'Set',
    todayLabel: 'Today',
    closeLabel: 'Close',
    mondayFirst: false,
    weeksList:  ["S", "M", "T", "W", "T", "F", "S"],
    monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
    templateType: 'popup',
    showTodayButton: true,
    dateFormat: 'dd MMMM yyyy',
    closeOnSelect: true,
    from: new Date(2012, 8, 2)
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

.controller('MainCtrl', function($scope, $state){
    
    $scope.showFooter = false;
    $scope.toggleFooter = function(){
      $scope.showFooter = !$scope.showFooter;
    };   
    $scope.bottomNav = function(){
      $state.go('bottom-nav');
    };
})

.controller('SlideboxCtrl', function($scope, $ionicSlideBoxDelegate){
  $scope.slideChanged=function(index){
    $scope.slideIndex = index;
  };
})

.controller('SideMenuCtrl', function($scope, $ionicPopover){
   $ionicPopover.fromTemplateUrl('side-menu.html', {
        scope: $scope,
    //    animation:'animated zoomInRight'
      }).then(function(popover) {
        $scope.popover = popover;
   //     console.log($scope.popover.isShown());
      });
     
      $scope.openPopover = function($event){
       $scope.popover.show($event);
   //    console.log($scope.popover.isShown());
       if($scope.popover.isShown()==true){
        console.log("opened");
      };
        
      };
      $scope.closePopover = function(){
        $scope.popover.hide();
      };
       $scope.$on('$destroy', function() {
         $scope.popover.remove();
      });
})

.controller('ProfileCtrl', function($scope, ionicDatePicker){
  $scope.wUnit = "kg";
  $scope.tWeight = 0;
  var todayDate = new Date();
  var diffInDays = 0;
  $scope.items=[{
    wUnit: "kg"
  }, {
    wUnit: "lbs"
  },];

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


})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
