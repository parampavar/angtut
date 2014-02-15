angular.module('FeedConfigManager', ['ngRoute', 'ngGrid', 'ngDragDrop'], 
	function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
		templateUrl: 'static/partials/landing.html',
		controller: IndexController
	});
	$routeProvider.when('/about', {
		templateUrl: 'static/partials/about.html',
		controller: AboutController
	});
	$routeProvider.when('/about/:name', {
		templateUrl: 'static/partials/about.html',
		controller: AboutController
	});
	$routeProvider.when('/feedconfigtype', {
		templateUrl: 'static/partials/show_feedconfigtypes.html',
		controller: FeedConfigTypeListController
	});
	$routeProvider.when('/feedconfigtype/:type_name', {
		templateUrl: 'static/partials/show_feedconfigtypes.html',
		controller: FeedConfigTypeLayoutController
	});
	// /* Create a "/blog" route that takes the user to the same place as "/feedconfigtype" */
	// $routeProvider.when('/blog', {
		// templateUrl: 'static/partials/show_feedconfigtypes.html',
		// controller: FeedConfigTypeListController
	// });

	$locationProvider.html5Mode(true);
});

function AboutController($scope, $routeParams) {
	$scope.aboutname = $routeParams.name;
}


function MainCntl($route, $routeParams, $location) {
  this.$route = $route;
  this.$location = $location;
  this.$routeParams = $routeParams;
}

function FeedConfigTypeLayoutController($routeParams, $scope) {
	// $scope.feedconfigtypelayout = {};
	// $scope.feedConfigTypeLayoutAvailableGridOptions = {};
	// $scope.feedConfigTypeLayoutSelectedGridOptions = {};
	$scope.showDetail = true;
	$scope.detailType = $routeParams.type_name;
	
	$scope.detailAvailableRowSchema = {};
	$scope.detailAvailableRowSchemaArray = [];

	$scope.detailAvailableRowKeySchema = {};
	$scope.detailAvailableRowKeySchemaArray = [];

	$scope.detailSelectedRowSchema = {};
	$scope.detailSelectedRowSchemaArray = [];
	
	$scope.enableSubmit = false;
	// Limit items to be dropped in list1
	$scope.optionsList1 = {
	accept: function(dragEl) {
	  if ($scope.list1.length >= 2) {
		return false;
	  } else {
		return true;
	  }
	}
	};
	
	$scope.$watch(
		function() {
			return $scope.detailSelectedRowSchemaArray;
		},
		function(newVal, oldVal) {
			$scope.enableSubmit = anyMatchInArray($scope.detailAvailableRowKeySchemaArray, newVal, "title");
		},
		true
	);
	$scope.submit = function() {
		console.log($scope.detailSelectedRowSchemaArray);
	};	
	getDocumentFromCouchbase("0|FEEDCONFIG", $routeParams, $scope, getFeedConfigTypeLayoutAvailable);
}

function FeedConfigTypeListController($routeParams, $scope) {
	
	$scope.showDetail = false;
	$scope.feedconfigtypes = {};
	$scope.feedConfigTypeGridOptions = {};
	$.ajaxSetup({ cache: false });
	
	var jfct = { "updatedby":"", "description":"", "type":"", "createdby":"", "name":"" };
	feedConfigTypesArray = jQuery.map( jfct, function( a ) {
		return a;
	});
	$scope.feedconfigtypes = jfct;

	$scope.feedConfigTypeGridOptions = { 
		data: 'feedconfigtypes',
		multiSelect: false,
        columnDefs: [
			{field:'type', displayName:'Type'}, 
			{field:'name', displayName:'Name'}, 
			{field:'description', displayName:'Description'}, 
			{field:'createdby', displayName:'Created By'},
			//{field:'editlayout', displayName: '', cellTemplate: '<div class="ngCellText"><a href="/feedconfigtype/CUSTOMER">Edit</a></div>'},
			{field:'editlayout', displayName: '', cellTemplate: '<div class="ngCellText"><a href="/feedconfigtype/{{row.entity.type}}">Edit</a></div>'},
			{field:'aboutlayout', displayName: '', cellTemplate: '<div class="ngCellText"><a href="/about/super">About</a></div>'}
			]
		};
 
	getDocumentFromCouchbase("1|FEEDCONFIG", $routeParams, $scope, getFeedConfigTypeList);
}


function getDocumentFromCouchbase(key, $routeParams, $scope, callback){
	try
	{
	$.getJSON('http://localhost:3000/default/' + key, function(data) {
	//$.getJSON('http://localhost:3000/default/1|FEEDCONFIG', function(data) {
	//$.getJSON('http://localhost:3000/default/1|FEEDCONFIG?callback=?', function() {
		//console.log("success");
		//console.log(data);
	})
	// .done(callback($routeParams, $scope, data))
	.done(function(jd) {
		//console.log(jd);
		callback($routeParams, $scope, jd);
	})
	.fail(function() {
		console.log("error");
	})
	.always(function() {
		console.log("complete");
	});
	}
	catch(ex)
	{
		console.log(ex)
	}
}

function getFeedConfigTypeList($routeParams, $scope, data){
	$scope.$apply(function(){
		
		$scope.feedconfigtypes = data.document['CONFIGS'];
		feedConfigTypesArray = jQuery.map( $scope.feedconfigtypes, function( a ) {
			return a;
		});
		$scope.feedconfigtypes = feedConfigTypesArray;
		$scope.feedConfigTypeGridOptions = { data: 'feedconfigtypes' };
		
	});	
	// console.log(data);
}

function getFeedConfigTypeLayoutAvailable($routeParams, $scope, data) {
	$scope.$apply(function(){
		console.log(data.document['CONFIGS'][$scope.detailType]);
		$scope.detailAvailableRowSchema = data.document['CONFIGS'][$scope.detailType]['rowschema'];
		$scope.detailAvailableRowSchemaArray = jQuery.map( $scope.detailAvailableRowSchema, function( a ) {
			var aj = {};
			aj = { 'title': a, 'drag': true}
			return aj;
		});
		$scope.detailAvailableRowKeySchema = data.document['CONFIGS'][$scope.detailType]['rowkeyschema'];
		$scope.detailAvailableRowKeySchemaArray = jQuery.map( $scope.detailAvailableRowKeySchema, function( a ) {
			var aj = {};
			aj = { 'title': a, 'drag': true}
			return aj;
		});
		//var feedconfigtypes = feedConfigTypesArray;
		//$scope.feedConfigTypeGridOptions = { data: 'feedconfigtypes' };
		// $scope.detailAvailableRowSchema = _detailAvailableRowSchema;
		// $scope.detailAvailableRowKeySchema = _detailAvailableRowKeySchema;
		
		console.log($scope.detailAvailableRowKeySchema);
		console.log($scope.detailAvailableRowKeySchemaArray);
		
	});	
}

var anyMatchInArray = (function () {
    "use strict";
    
    var func;
    
    func = function (targetArray, checkerArray, attributeName) {
        var found = false;
		var targetAttributeArray = jQuery.map( targetArray, function( a ) {
			return a[attributeName];
		});
        for (var i = 0, j = checkerArray.length; !found && i < j; i++) {
            if (targetAttributeArray.indexOf(checkerArray[i][attributeName]) > -1) {
                found = true;
            }
        }
        return found;
    };
    
    return func;
}());
 
// Create the XHR object.
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}


// Make the actual CORS request.
function makeCorsRequest() {
  // All HTML5 Rocks properties support CORS.
  var url = 'http://updates.html5rocks.com';
  url = 'http://localhost:3000/default/1|FEEDCONFIG?callback=?';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    console.log('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onreadystatechange  = function(evtXHR) {
		if (xhr.readyState == 4)
        {
			console.log("xhr.status=" + xhr.status);
                if (xhr.status == 200)
                {
                    //var response = xhr.responseXML;
					console.log("responseXML =" + xhr.responseXML);
					console.log("responseText =" + xhr.responseText);
                }
                else
                    console.log("xhr Errors Occured");
        }
        else
            console.log("currently the application is at" + xhr.readyState);
	console.log('Response from CORS request to ' + url + ': ');
  };

  xhr.onerror = function() {
    console.log('Woops, there was an error making the request.');
  };

  xhr.send();
}