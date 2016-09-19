
angular.module('myApp', ['ionic', 'ngCordova', 'ionic-datepicker', 'ProfileDetails', 'RoutinesList', 'RoutineDetails', 'MealPlanner','gridster'])

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
  });
  $urlRouterProvider.otherwise('/main');
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

    $scope.extraWidgets=[];

    $scope.addWidget = function(tryWidget){
      $scope.extraWidgets.push({
          sizeX: 2,
          sizeY: 2,
          row: 0,
          col: 1
      });

    }

 /*   $scope.customItems = [
   //   { size: { x: 2, y: 1 }, position: [0, 0] },
      {
          size: { x: 2, y: 2 },
          position: [0, 0] 
      }
    ];*/

    $scope.customItemMap = {
        sizeX: 'item.size.x',
        sizeY: 'item.size.y',
        row: 'item.position[0]',
        col: 'item.position[1]',
        minSizeY: 'item.minSizeY',
        maxSizeY: 'item.maxSizeY'
    };
    

    $scope.gridsterOpts = {
        columns: 4, // the width of the grid, in columns
        pushing: true, // whether to push other items out of the way on move or resize
        floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
        swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        outerMargin: true, // whether margins apply to outer edges of the grid
        isMobile: false, // stacks the grid items if true
        mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
        mobileModeEnabled: false, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
        minColumns: 1, // the minimum columns the grid must have
        minRows: 2, // the minimum height of the grid, in rows
        maxRows: 100,
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        minSizeX: 2, // minimum column width of an item
        maxSizeX: null, // maximum column width of an item
        minSizeY: 1, // minumum row height of an item
        maxSizeY: null, // maximum row height of an item
        saveGridItemCalculatedHeightInMobile: false, // grid item height in mobile display. true- to use the calculated height by sizeY given
        resizable: {
           enabled: true,
           handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
           start: function(event, $element, widget) {}, // optional callback fired when resize is started,
           resize: function(event, $element, widget) {}, // optional callback fired when item is resized,
           stop: function(event, $element, widget) {} // optional callback fired when item is finished resizing
        },
        draggable: {
           enabled: true, // whether dragging items is supported
          // handle: '.my-class', // optional selector for drag handle
           scrollSensitivity: 20, // Distance in pixels from the edge of the viewport after which the viewport should scroll, relative to pointer
           scrollSpeed: 15, // Speed at which the window should scroll once the mouse pointer gets within scrollSensitivity distance
           start: function(event, $element, widget) {}, // optional callback fired when drag is started,
           drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
           stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
        }
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

.directive('weightWidget',
  function(){
  return{
    templateUrl:'/templates/tryWidgetTemplate.html'
  }
})

.directive('measurementsWidget',
  function(){
  return{
    templateUrl:'/templates/measurementsWidgetTemplate.html'
  }
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