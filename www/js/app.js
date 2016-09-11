
angular.module('myApp', ['ionic', 'ngCordova', 'ionic-datepicker', 'ProfileDetails', 'RoutinesList', 'RoutineDetails', 'MealPlanner'])

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
   controller:'ProfileDetailsCtrl'
  })
  .state('routinesList',{
   url:'/routinesList',
   templateUrl:'templates/routines-list.html',
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
  .state('mealsList',{
   url:'/mealsList/:dateId',
   templateUrl:'js/meals-list/meals-list.html',
   controller:''
  });
  $urlRouterProvider.otherwise('/mealPlanner');
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
