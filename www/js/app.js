
angular.module('myApp', ['ionic', 'ngCordova', 'ionic-datepicker', 'ProfileDetails', 'RoutinesList', 'RoutineDetails', 'MealPlanner','gridster','MainPage','WeightWidget','MeasurementsWidget','FoodWidget','ExerciseWidget','CaloriesWidget','CameraWidget','ProgressChart','CustomWidget'])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
  $ionicConfigProvider.views.maxCache(0);
  $stateProvider
  .state('main-page',{
      url:'/main', 
      templateUrl: 'main-page.html',
      controller:'MainCtrl'
  })
  .state('bottom-nav',{
    parent: 'main-page',
    url:'/', templateUrl: 'bottom-nav.html',
    controller:'SlideboxCtrl'
  })
  .state('profile',{
   url:'/profile',
   templateUrl:'js/profile-details/profile-details.html',
   controller:'ProfileDetailsCtrl'
  })
  .state('routinesList',{
   url:'/routinesList',
   templateUrl:'js/routine-list/routines-list.html',
   controller:'RoutinesListCtrl'
  })
  .state('routineDetails',{
   url:'/routineDetails/:id',
   templateUrl:'js/routine-details/routine-details.html',
   controller:'RoutineDetailsCtrl'
  })
  .state('mealPlanner',{
   url:'/mealPlanner',
   templateUrl:'js/meal-planner/meal-planner.html',
   controller:'MealPlannerListCtrl'
  })
  .state('progressChart',{
    url: '/progressChart',
    templateUrl:'js/progress-chart/progress-chart.html',
    controller:'ProgressChartCtrl'
  })
  .state('setting',{
   url:'/setting',
   templateUrl:'setting.html',
   controller:'settingCtrl'
  });
  $urlRouterProvider.otherwise('/main');
})

//configuration for the datepickers used in the application
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
    from: new Date(2016, 1, 1)
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);
  })

//controller for footer slider
.controller('SlideboxCtrl', function($scope, $ionicSlideBoxDelegate){
  $scope.slideChanged=function(index){
    $scope.slideIndex = index;
  };
})

//controller for theme settings
.controller('settingCtrl', ['$scope','MainService','$window',
  function($scope,MainService,$window){
    
    initData();
    $scope.stylePath = "css/beige.css";

    function initData()
    {
      MainService.initDB(); //open the database and create the table
      getTheme();
    }
    
//get previous theme from database
    function getTheme()
    {
      try{
          MainService.getChosenTheme()
          .then(function(response){
            try
            {
              if(response && response.rows && response.rows.length > 0)
              {
                $scope.stylePath = response.rows.item(0).theme;
                console.log($scope.stylePath);
              }else
              {
                console.log("No themes created till now."); 
                $scope.stylePath = "css/beige.css"; //set beige theme as default
              }
            }catch(e)
            {
              console.log("Error in getTheme controller "+e.message);
            }
          },function(error)
          {
            console.log("Error in getting theme");
          });
        }catch(e)
        {
          alert("Error in getTheme controller "+e.message);
        }
      
    }

//add the theme to the database
    $scope.addTheme = function(style)
    {
      try{
            console.log(style);
            MainService.addTheme(style)
            .then(function(response)
            {
              getTheme(); //retrieve the themes again
              window.location.reload(true); //reload the application to show the new color
            },function(error)
            {
              alert("Error in add theme");
            });
          }catch(e)
          {
              alert("Error in addTheme "+e.message);
          }
    }
}])

//controller for side menu pop-over
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

.run(['gridsterConfig', function(gridsterConfig) {
    gridsterConfig.width = window.width;
}]);