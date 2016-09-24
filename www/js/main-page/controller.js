var mainPageModule = angular.module('MainPage',['ngCordova','ionic','gridster']);

mainPageModule.controller('MainCtrl',['$scope','$state','$cordovaSQLite','$ionicPlatform','MainService', '$cordovaVibration','$timeout',
	function($scope,$state,$cordovaSQLite,$ionicPlatform,MainService,$cordovaVibration,$timeout){

		initData();
	  	initMethods();

		$scope.showFooter = false;
	    $scope.toggleFooter = function(){
	      $scope.showFooter = !$scope.showFooter;
	    };   
	    $scope.bottomNav = function(){
	      $state.go('bottom-nav');
	    };

	    function initData(){
	    	$scope.widgetList=[];
	    	MainService.initDB();
	    	fetchWidget();
	    }

	    function initMethods(){
	    	$scope.addWeightWidget = addWeightWidget;
	    	$scope.addMeasurementsWidget = addMeasurementsWidget;
	    	$scope.draggable = draggable;
	    //	$scope.disableDraggable = disableDraggable;
	    	$scope.addWidgetTemplate = addWidgetTemplate;
	    	$scope.deleteWidget = deleteWidget;
	    }
	    

	    function addWeightWidget(){
	    	$scope.widgetList.push({
	    	  title: "Weight",
	          sizeX: 2,
	          sizeY: 2,
	          row: 0,
	          col: 0,
	          directives : "<weight-widget></weight-widget>",
	      });
	    	try{
	      		var lastItem = $scope.widgetList.length - 1;
	      		MainService.addNewWidget($scope.widgetList[lastItem].title,$scope.widgetList[lastItem].row,$scope.widgetList[lastItem].col, $scope.widgetList[lastItem].sizeX, $scope.widgetList[lastItem].sizeY, $scope.widgetList[lastItem].directives)
				.then(function(response){
				//	alert("Saved widget");
					//	fetchWidget();
				},function(error){
					alert("Error in changing template");
				});
	      	}catch(e){
	      		alert("Error in addWeightTemplate "+e.message);
	      	}
	    }
	   	
	   	function addMeasurementsWidget(){
	   		$scope.widgetList.push({
	   		  title: "Measurements",
	          sizeX: 3,
	          sizeY: 1,
	          row: 0,
	          col: 1,
	          directives : "<measurements-widget></measurements-widget>"
	      	});
	      	try{
	      		var lastItem = $scope.widgetList.length - 1;
	      		MainService.addNewWidget($scope.widgetList[lastItem].title,$scope.widgetList[lastItem].row,$scope.widgetList[lastItem].col, $scope.widgetList[lastItem].sizeX, $scope.widgetList[lastItem].sizeY, $scope.widgetList[lastItem].directives)
				.then(function(response){
				//	alert("Saved widget");
					//	fetchWidget();
				},function(error){
					alert("Error in changing template");
				});
	      	}catch(e){
	      		alert("Error in addMeasurementsTemplate "+e.message);
	      	}
	   	}
	  	
	  	function fetchWidget() {
			try{
				MainService.getAllWidget()
				.then(fetchSuccessCB,fetchErrorCB);
			}catch(e){
				alert("Error in fetchWidget controller "+e.message);
			}
			
		}

		function addWidgetTemplate()
		{
			try{
				MainService.deleteTable()
				.then(function(response){
					try{
						for(var i=0; i<$scope.widgetList.length; i++){
							MainService.addNewWidget($scope.widgetList[i].title,$scope.widgetList[i].row,$scope.widgetList[i].col, $scope.widgetList[i].sizeX, $scope.widgetList[i].sizeY, $scope.widgetList[i].directives)
							.then(function(response){
						//		alert("Saved template");
							//	fetchWidget();
							},function(error){
								alert("Error in changing template");
							});
						}
					}catch(e){
						alert(e.message);
					}
					
				},function(error){
					alert("Error in dropping table ");
				});
				
			}
			catch(e){
				alert("Error in addWidgetTemplate controller "+e.message);
			}
		}

		function deleteWidget(index,id)
		{
			try{
				if(index > -1)
				{	
					MainService.deleteWidget(id)
					.then(function(response){
						$scope.widgetList.splice(index,1);
				//		alert("Entry has been succesfully deleted.");
						fetchWidget();
					},function(error){
						alert("Error in delete new widget");
					});	
				}
			}catch(e){
				alert("Error in deleteWidget "+e.message);
			}
			
		}

		function fetchSuccessCB(response)
		{
			try{
				if(response && response.rows && response.rows.length > 0)
				{
					$scope.widgetList = [];
					var lastId= response.rows.length - 1;
					for(var i=0;i<response.rows.length;i++)
					{
						$scope.widgetList.push
						({
							id:response.rows.item(i).id,
							title:response.rows.item(i).title,
							row:response.rows.item(i).row,
							col:response.rows.item(i).col,
							sizeX:response.rows.item(i).sizeX,
							sizeY:response.rows.item(i).sizeY,
							directives:response.rows.item(i).directives
						});
					
					}
					
				}else
				{
					alert("No widgets created till now."); 
				}
			}catch(e){
				alert("Error in fetchSuccessCB controller "+e.message);
			}
			
		}

		function fetchErrorCB(error)
		{
			alert("Some error occurred in fetching Widgets");
		}

	    $scope.gridsterOpts = {
	        columns: 4, // the width of the grid, in columns
	        pushing: true, // whether to push other items out of the way on move or resize
	        floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
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
	           stop: function(event, $element, widget) {
	           		addWidgetTemplate();
	           } // optional callback fired when item is finished resizing
	        },
	        draggable: {
	           enabled: false, // whether dragging items is supported
	         //  handle: '.my-class', // optional selector for drag handle
	           scrollSensitivity: 20, // Distance in pixels from the edge of the viewport after which the viewport should scroll, relative to pointer
	           scrollSpeed: 15, // Speed at which the window should scroll once the mouse pointer gets within scrollSensitivity distance
	           start: function(event, $element, widget) {}, // optional callback fired when drag is started,
	           drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
	           stop: function(event, $element, widget) {
	           		addWidgetTemplate();
	           		disableDraggable();
	           } // optional callback fired when item is finished dragging
	        }
	    };

	    function draggable(){
	    	$scope.gridsterOpts = {
     			draggable: {
       			 	enabled: true
      			}
    		 }
	    //	$timeout(delayFunction, 300);
	    }

	    function delayFunction(){
	    	console.log("enabled");
	   		
	    	$scope.gridsterOpts = {
     			draggable: {
       			 	enabled: true
      			}
    		 }
    		 
    		//$cordovaVibration.vibrate(100);
	    }
	    
	    function disableDraggable(){
	    	console.log("disabled");
	    	$scope.gridsterOpts = {
     			draggable: {
       			 	enabled: false
      			}
    		}
	    }
	}
]);

mainPageModule.directive('compileDirective', function($compile) {
        return {
          restrict: "E",
          replace: false,
          link: function(scope, element, attr) {
            scope.$watch(function() {
              return attr.directive;
            }, function(val) {
              if (val) {
                var directive = $compile(angular.element(val))(scope);
                element.append(directive);
              }
            });
          }
        };
});

mainPageModule.directive('weightWidget',
  function($compile){
  return{
    replace: false,
    templateUrl:'/templates/tryWidgetTemplate.html'
  }
});

mainPageModule.directive('measurementsWidget',
  function($compile){
  return{
    replace: false,
    templateUrl:'/templates/measurementsWidgetTemplate.html'
  }
});
