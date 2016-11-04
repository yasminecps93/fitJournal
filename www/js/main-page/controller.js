var mainPageModule = angular.module('MainPage',['ngCordova','ionic','gridster']);

mainPageModule.controller('MainCtrl',['$rootScope','$scope','$state','$cordovaSQLite','$ionicPlatform','MainService', '$cordovaVibration','$window','$ionicPopup',
	function($rootScope,$scope,$state,$cordovaSQLite,$ionicPlatform,MainService,$cordovaVibration,$window,$ionicPopup){

		initData();
	  	initMethods();
	  	$scope.idIndex = -1;
	  	var yPosition = 0;
	  	var maxLength = 0;
	  	var newYPosition = 0;
	  	var isDelete = "";
	  	$scope.stylePath = "";
		$scope.showFooter = false;
		$scope.isExist = false; //to check if this widget already exist
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
	    	$scope.addCameraWidget = addCameraWidget;
	    	$scope.addCaloriesWidget = addCaloriesWidget;
	    	$scope.addWidgetTemplate = addWidgetTemplate;
	    	$scope.deleteWidget = deleteWidget;
	    }
	    
//-----------------------------------------------------------------------------//
//--------------------------------THEME----------------------------------------//
//-----------------------------------------------------------------------------//
		
		

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
	   		if($scope.widgetList.length>0)
	   		{
	   			for(var i=0; i<$scope.widgetList.length; i++)
	   			{
	   				if($scope.widgetList[i].title == "Weight"){
	   					$scope.isExist = true;
	   					break;
	   				}
	   			}
	   		}
	    	calculateLastWidgetPosition();
	    	console.log(newYPosition);
	    	try{	
	    		if($scope.isExist == false)
	    		{
	    			MainService.addNewWidget("Weight",newYPosition,0, 2, 2, "<weight-widget></weight-widget>")
					.then(function(response)
					{
						fetchWidget();
					},function(error)
					{
						console.log("Error in changing template");
					});
	    		}else
	    		{
	    			alert("This widget already exists!");
	    			$scope.isExist = false;
	    		}
	      	}
	      	catch(e)
	      	{
	      		console.log("Error in addWeightTemplate "+e.message);
	    	}
	    		
	    }
	   	
	   	function addMeasurementsWidget(){
	   		if($scope.widgetList.length>0)
	   		{
	   			for(var i=0; i<$scope.widgetList.length; i++)
	   			{
	   				if($scope.widgetList[i].title == "Measurements"){
	   					$scope.isExist = true;
	   					break;
	   				}
	   			}
	   		}
	   		calculateLastWidgetPosition();
	      	try{
	      		if($scope.isExist == false)
	    		{
		      		MainService.addNewWidget("Measurements",newYPosition,0, 3, 1, "<measurements-widget></measurements-widget>")
					.then(function(response){
					 	fetchWidget();
					},function(error){
						console.log("Error in changing template");
					});
				}else
				{
					alert("This widget already exists!");
	    			$scope.isExist = false;
				}
	      	}catch(e){
	      		console.log("Error in addMeasurementsTemplate "+e.message);
	      	}
	   	}

	   	function addFoodWidget(){
	   		if($scope.widgetList.length>0)
	   		{
	   			for(var i=0; i<$scope.widgetList.length; i++)
	   			{
	   				if($scope.widgetList[i].title == "Food Intake")
	   				{
	   					$scope.isExist = true;
	   					break;
	   				}
	   			}
	   		}
	   		calculateLastWidgetPosition();
	      	try{
	      		if($scope.isExist == false)
	    		{
		      		MainService.addNewWidget("Food Intake",newYPosition,0, 3, 3, "<food-widget></food-widget>")
					.then(function(response){
					 	fetchWidget();
					},function(error){
						console.log("Error in changing template");
					});
				}else{
					alert("This widget already exists!");
	    			$scope.isExist = false;
				}
	      	}catch(e){
	      		console.log("Error in addFoodTemplate "+e.message);
	      	}
	   	}

	   	function addExerciseWidget(){
	   		if($scope.widgetList.length>0)
	   		{
	   			for(var i=0; i<$scope.widgetList.length; i++)
	   			{
	   				if($scope.widgetList[i].title == "Exercise Log")
	   				{
	   					$scope.isExist = true;
	   					break;
	   				}
	   			}
	   		}
	   		calculateLastWidgetPosition();
	      	try{
	      		if($scope.isExist == false)
	    		{
		      		MainService.addNewWidget("Exercise Log",newYPosition,0, 2, 2, "<exercise-widget></exercise-widget>")
					.then(function(response){
					 	fetchWidget();
					},function(error){
						console.log("Error in changing template");
					});
				}else{
					alert("This widget already exists!");
	    			$scope.isExist = false;
				}
	      	}catch(e){
	      		console.log("Error in addExerciseTemplate "+e.message);
	      	}
	   	}

	   	function addCameraWidget(){
	   		$scope.isEmpty = false; //for empty input
	   		if($scope.header.name != ""){
	   			if($scope.widgetList.length>0)
		   		{	
		   			for(var i=0; i<$scope.widgetList.length; i++)
		   			{
		   				if($scope.widgetList[i].title == $scope.header.name && $scope.widgetList[i].directives == "<camera-widget></camera-widget>")
		   				{
		   					$scope.isExist = true;
		   					break;
		   				}
		   			}
		   		}
	   		}else{
	   			alert("Empty inputs!");
	   			$scope.isEmpty = true;
	   		}
	   		
	   		calculateLastWidgetPosition();
	      	try{
	      		if($scope.isExist == false && $scope.isEmpty == false){
	      			MainService.addNewWidget($scope.header.name,newYPosition,0, 4, 4, "<camera-widget></camera-widget>")
					.then(function(response){
					 	fetchWidget();
					},function(error){
						console.log("Error in changing template");
					});
	      		}else if ($scope.isExist == true && $scope.isEmpty == false){
	   				alert("This header already exists!");
	   				$scope.isExist = false;
	   			}
	      		
	      	}catch(e){
	      		console.log("Error in addCameraTemplate "+e.message);
	      	}
	   	}

	   	function addCaloriesWidget(){
	   		if($scope.widgetList.length>0)
	   		{
	   			for(var i=0; i<$scope.widgetList.length; i++)
	   			{
	   				if($scope.widgetList[i].title == "Exercise Log")
	   				{
	   					$scope.isExist = true;
	   					break;
	   				}
	   			}
	   		}
	   		calculateLastWidgetPosition();
	      	try{
	      		if($scope.isExist == false)
	    		{
		      		MainService.addNewWidget("Calories Counter",newYPosition,0, 3, 2, "<calories-widget></calories-widget>")
					.then(function(response){
					 	fetchWidget();
					},function(error){
						console.log("Error in changing template");
					});
				}else{
					alert("This widget already exists!");
	    			$scope.isExist = false;
				}
	      	}catch(e){
	      		console.log("Error in addCaloriesTemplate "+e.message);
	      	}
	   	}
	  	
	   	function addCustomWidget(){
	   		$scope.isEmpty = false; //for empty input
	   		if($scope.header.name != ""){
	   			if($scope.widgetList.length>0)
		   		{	
		   			for(var i=0; i<$scope.widgetList.length; i++)
		   			{
		   				if($scope.widgetList[i].title == $scope.header.name && $scope.widgetList[i].directives == "<custom-widget></custom-widget>")
		   				{
		   					$scope.isExist = true;
		   					break;
		   				}
		   			}
		   		}
	   		}else{
	   			alert("Empty inputs!");
	   			$scope.isEmpty = true;
	   		}
	   		calculateLastWidgetPosition();
	   		try{
	   			if($scope.isExist == false && $scope.isEmpty == false){
	   				MainService.addNewWidget($scope.header.name,newYPosition,0, 2, 2, "<custom-widget></custom-widget>")
					.then(function(response){
						fetchWidget();
					},function(error){
						console.log("Error in changing template");
					});
	   			}else if($scope.isExist == true && $scope.isEmpty == false){
	   				alert("This header already exists!");
	   				$scope.isExist = false;
	   			}
	   			
	   		}catch(e){
	   			console.log("Error in addCustomWidget "+e.message);
	   		}
	   	}

	  	function fetchWidget() {
			try{
				MainService.getAllWidget()
				.then(fetchSuccessCB,fetchErrorCB);
			}catch(e){
				console.log("Error in fetchWidget controller "+e.message);
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
								console.log("Error in changing template");
							});
						}
					}catch(e){
						console.log(e.message);
					}
					
				},function(error){
					console.log("Error in dropping table ");
				});
				
			}
			catch(e){
				console.log("Error in addWidgetTemplate controller "+e.message);
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
							$window.location.reload(true);
						console.log("in delete success");
					},function(error){
						console.log("Error in delete widget");
					});	
				}
			}catch(e){
				console.log("Error in deleteWidget "+e.message);
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
					console.log("No widgets created till now."); 
				}
			}catch(e){
				console.log("Error in fetchSuccessCB controller "+e.message);
			}
			
		}

		function fetchErrorCB(error)
		{
			console.log("Some error occurred in fetching Widgets");
		}


//----------------------------------------------------------------------------------------//
//------------------------------GRIDSTER CONFIG-------------------------------------------//
//----------------------------------------------------------------------------------------//
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
//----------------------------------------------------------------------------------------//
//----------------------------------POPUP-------------------------------------------------//
//----------------------------------------------------------------------------------------//
	$scope.showPopup = function(){
  			$scope.header = {
				name: ''
			};
			
  			$scope.data={}
  			var entrypopup = $ionicPopup.show({
  				templateUrl:'add-header-popup.html',
  				title: 'Enter header name',
  				scope: $scope,
  				buttons:[
  				{
  					text: 'Cancel', onTap:
  					function(e){ return true;}
  				},{
  					text:'Save',
  					type:'button-positive',
  					onTap:function(e){
  						addCustomWidget();
  					}
  				}
  				]
  			});
  			$scope.closePopup = function(){
	  			entrypopup.close();
	  		}
  		}
	   
	   $scope.showImagePopup = function(){
  			$scope.header = {
				name: ''
			};
			
  			$scope.data={}
  			var imagepopup = $ionicPopup.show({
  				templateUrl:'add-header-popup.html',
  				title: 'Enter header name',
  				scope: $scope,
  				buttons:[
  				{
  					text: 'Cancel', onTap:
  					function(e){ return true;}
  				},{
  					text:'Save',
  					type:'button-positive',
  					onTap:function(e){
  						addCameraWidget();
  					}
  				}
  				]
  			});
  			$scope.closePopup = function(){
	  			imagepopup.close();
	  		}
  		}
	}
]);

//----------------------------------------------------------------------------------------//
//----------------------------------DIRECTIVES--------------------------------------------//
//----------------------------------------------------------------------------------------//

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
		            var directive = $compile(angular.element(val))(scope);
		            element.append(directive);
		         }
            	});
          	}
        };
});

mainPageModule.directive('weightWidget',
	function($compile,$rootScope){
	  
	  	function link(scope, element, attributes,controller) {
	  	
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
	  	
	}
  return{
  	controller: 'ExerciseWidgetCtrl',
  	link: link,
    replace: false,
    templateUrl:'js/main-page/templates/exerciseWidgetTemplate.html'
  }
});

mainPageModule.directive('cameraWidget',
  function($compile,$rootScope){
  	function link(scope, element, attributes,controller) {
	  	
	}
  return{
  	controller: 'CameraWidgetCtrl',
//  	scope: {},
  	link: link,
    replace: false,
    templateUrl:'js/main-page/templates/cameraWidgetTemplate.html'
  }
});


mainPageModule.directive('caloriesWidget',
  function($compile,$rootScope){
  	function link(scope, element, attributes,controller) {
	  	
	}
  return{
  	controller: 'CaloriesWidgetCtrl',
  	link: link,
    replace: false,
    templateUrl:'js/main-page/templates/caloriesWidgetTemplate.html'
  }
});

mainPageModule.directive('customWidget',
  function($compile,$rootScope){
  	function link(scope, element, attributes,controller) {
	  	
	}
  return{
  	controller: 'CustomWidgetCtrl',
  	link: link,
    replace: false,
    templateUrl:'js/main-page/templates/customWidgetTemplate.html'
  }
});

