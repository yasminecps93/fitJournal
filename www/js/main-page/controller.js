var mainPageModule = angular.module('MainPage',['ngCordova','ionic','gridster']);

mainPageModule.controller('MainCtrl',['$rootScope','$scope','$state','$cordovaSQLite','$ionicPlatform','MainService', '$cordovaVibration','$window',
	function($rootScope,$scope,$state,$cordovaSQLite,$ionicPlatform,MainService,$cordovaVibration,$window){

		initData();
	  	initMethods();

	  	var yPosition = 0;
	  	var maxLength = 0;
	  	var newYPosition = 0;
	  	var isDelete = "";
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
	    	$scope.addFoodWidget = addFoodWidget;
	    	$scope.addExerciseWidget = addExerciseWidget;
	    	$scope.addCaloriesWidget = addCaloriesWidget;
	    	$scope.addWidgetTemplate = addWidgetTemplate;
	    	$scope.deleteWidget = deleteWidget;
	    	$scope.removeDirective = removeDirective;
	    }
	    
	    function calculateLastWidgetPosition(){
	    	var temp = 0;
	    	newYPosition = 0;
	    	if($scope.widgetList.length>0){
	    		for(var i=0; i<$scope.widgetList.length; i++){
	    			yPosition = $scope.widgetList[i].row;
	    			maxLength = $scope.widgetList[i].sizeY;
	    			temp = yPosition+maxLength;
	    				if(temp>newYPosition){
	    					newYPosition=temp;
	    				}
	    		}
	    	}
	    	
	    }

	   	function addWeightWidget(){
	    	calculateLastWidgetPosition();
	    	console.log(newYPosition);
	    	try{
	      		MainService.addNewWidget("Weight",newYPosition,0, 2, 2, "<weight-widget></weight-widget>")
				.then(function(response){
				fetchWidget();
				},function(error){
					alert("Error in changing template");
				});
	      	}catch(e){
	      		alert("Error in addWeightTemplate "+e.message);
	      	}
	    }
	   	
	   	function addMeasurementsWidget(){
	   		calculateLastWidgetPosition();
	      	try{
	      		MainService.addNewWidget("Measurements",newYPosition,0, 3, 1, "<measurements-widget></measurements-widget>")
				.then(function(response){
				 	fetchWidget();
				},function(error){
					alert("Error in changing template");
				});
	      	}catch(e){
	      		alert("Error in addMeasurementsTemplate "+e.message);
	      	}
	   	}

	   	function addFoodWidget(){
	   		calculateLastWidgetPosition();
	      	try{
	      		MainService.addNewWidget("Food Intake",newYPosition,0, 3, 4, "<food-widget></food-widget>")
				.then(function(response){
				 	fetchWidget();
				},function(error){
					alert("Error in changing template");
				});
	      	}catch(e){
	      		alert("Error in addFoodTemplate "+e.message);
	      	}
	   	}

	   	function addExerciseWidget(){
	   		calculateLastWidgetPosition();
	      	try{
	      		MainService.addNewWidget("Calories Counter",newYPosition,0, 2, 2, "<exercise-widget></exercise-widget>")
				.then(function(response){
				 	fetchWidget();
				},function(error){
					alert("Error in changing template");
				});
	      	}catch(e){
	      		alert("Error in addFoodTemplate "+e.message);
	      	}
	   	}

	   	function addCaloriesWidget(){
	   		calculateLastWidgetPosition();
	      	try{
	      		MainService.addNewWidget("Calories Counter",newYPosition,0, 2, 2, "<calories-widget></calories-widget>")
				.then(function(response){
				 	fetchWidget();
				},function(error){
					alert("Error in changing template");
				});
	      	}catch(e){
	      		alert("Error in addFoodTemplate "+e.message);
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
			console.log(index);
			try{
				if(index > -1)
				{	
					MainService.deleteWidget(id)
					.then(function(response){
						// removeDirective(function(){
						// 	fetchWidget();
						// });
						// if(index!=$scope.widgetList.length){
							removeDirective();
						// }
						console.log("in delete success");
						 fetchWidget();
					//	removeDirective();
					},function(error){
						alert("Error in delete widget");
					});	
				}
			}catch(e){
				alert("Error in deleteWidget "+e.message);
			}
			
		}

		 function removeDirective() {
		    $rootScope.$emit('destroyDirective');
		   // $window.location.reload(true);
		  };

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
	        floating: false, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
	        swapping: true, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
	        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
	        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
	        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
	        margins: [7, 7], // the pixel distance between each widget
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
	           enabled: true, // whether dragging items is supported
	           handle: '.widget-header', // optional selector for drag handle
	           scrollSensitivity: 20, // Distance in pixels from the edge of the viewport after which the viewport should scroll, relative to pointer
	           scrollSpeed: 15, // Speed at which the window should scroll once the mouse pointer gets within scrollSensitivity distance
	           start: function(event, $element, widget) {}, // optional callback fired when drag is started,
	           drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
	           stop: function(event, $element, widget) {
	           		addWidgetTemplate();
	           } // optional callback fired when item is finished dragging
	        }
	    };

	   
	}
]);

mainPageModule.directive('compileDirective', function($compile,$rootScope) {
        var uniqueId = 0;
        return {
          restrict: "E",
          replace: false,
          link: function(scope, element, attr) {
          	
          		 scope.$watch(function() {
             		 return attr.directive;
            	}, function(val) {
            	if (val) {
            		// $rootScope.$on('destroyDirective',function(){
            		// 	console.log("delete val= "+val);
		          		// var directive1 = $compile(angular.element(val))(scope);
			           //  element.remove(directive1);
            		// });
		            //  	console.log("val= "+val);
		            //  	var item = 'item' + uniqueId++;
		                var directive = $compile(angular.element(val))(scope);
		                element.append(directive);
		             //   element.find('compile-directive').attr('id',item);
		         }
            	});
          	}
        };
});

mainPageModule.directive('weightWidget',
	function($compile,$rootScope){
	  
	  	function link(scope, element, attributes,controller) {
	  		// $rootScope.$on('destroyDirective', function () {
	    //     element.html('');
	  		// 	console.log("deleted");
	    //   });
	  		// scope.remove = function(){
	  		// 	element.html('');
	  		// 	console.log("deleted");
	  		// };
	    }
	   return({
	   	controller: 'WeightWidgetCtrl',
	    replace: false,
	    link: link,
	    templateUrl:'js/main-page/templates/weightWidgetTemplate.html'
     });

  
});

mainPageModule.directive('measurementsWidget',
  function($compile,$rootScope){
  	function link(scope, element, attributes,controller) {
	  		// $rootScope.$on('destroyDirective', function () {
	    //     element.html('');
	  		// 	console.log("deleted");
	    //   });
	  		// scope.remove = function(){
	  		// 	element.html('');
	  		// 	console.log("deleted");
	  		// };
	}
  return{
  	controller: 'MeasurementsWidgetCtrl',
  	link: link,
    replace: false,
    templateUrl:'js/main-page/templates/measurementsWidgetTemplate.html'
  }
});

mainPageModule.directive('foodWidget',
  function($compile,$rootScope){
  	function link(scope, element, attributes,controller) {
	  		// $rootScope.$on('destroyDirective', function () {
	    //     element.html('');
	  		// 	console.log("deleted");
	    //   });
	  		// scope.remove = function(){
	  		// 	element.html('');
	  		// 	console.log("deleted");
	  		// };
	}
  return{
  	controller: 'FoodWidgetCtrl',
  	link: link,
    replace: false,
    templateUrl:'js/main-page/templates/foodWidgetTemplate.html'
  }
});

mainPageModule.directive('exerciseWidget',
  function($compile,$rootScope){
  	function link(scope, element, attributes,controller) {
	  		// $rootScope.$on('destroyDirective', function () {
	    //     element.html('');
	  		// 	console.log("deleted");
	    //   });
	  		// scope.remove = function(){
	  		// 	element.html('');
	  		// 	console.log("deleted");
	  		// };
	}
  return{
  	controller: 'ExerciseWidgetCtrl',
  	link: link,
    replace: false,
    templateUrl:'js/main-page/templates/exerciseWidgetTemplate.html'
  }
});


mainPageModule.directive('caloriesWidget',
  function($compile,$rootScope){
  	function link(scope, element, attributes,controller) {
	  		// $rootScope.$on('destroyDirective', function () {
	    //     element.html('');
	  		// 	console.log("deleted");
	    //   });
	  		// scope.remove = function(){
	  		// 	element.html('');
	  		// 	console.log("deleted");
	  		// };
	}
  return{
  	controller: 'CaloriesWidgetCtrl',
  	link: link,
    replace: false,
    templateUrl:'js/main-page/templates/caloriesWidgetTemplate.html'
  }
});
