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

function FeedConfigTypeListController($routeParams, $scope) {
	
	$scope.showDetail = false;
	$scope.currentDocument = {};
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
			{field:'editlayout', displayName: '', cellTemplate: '<div class="ngCellText"><a href="/feedconfigtype/{{row.entity.type}}">Edit</a></div>'},
			{field:'aboutlayout', displayName: '', cellTemplate: '<div class="ngCellText"><a href="/about/super">About</a></div>'}
			]
		};
 
	getDocumentFromCouchbase("1|FEEDCONFIG", $routeParams, $scope, getFeedConfigTypeList);
}

function getFeedConfigTypeList($routeParams, $scope, data){
	$scope.$apply(function(){
		$scope.currentDocument = data.document;
		$scope.feedconfigtypes = data.document['CONFIGS'];
		feedConfigTypesArray = jQuery.map( $scope.feedconfigtypes, function( a ) {
			return a;
		});
		$scope.feedconfigtypes = feedConfigTypesArray;
		$scope.feedConfigTypeGridOptions = { data: 'feedconfigtypes' };
		
	});	
}

function FeedConfigTypeLayoutController($routeParams, $scope) {
	$scope.submitStatus = false;
	$scope.submitMessage = "Changes successfully saved";
	$scope.showDetail = true;
	$scope.detailType = $routeParams.type_name;
	$scope.currentDocument = {};
	
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
			$scope.enableSubmit = anyMatchInArray($scope.detailSelectedRowSchema, $scope.detailAvailableRowKeySchemaArray, newVal, "title");
		},
		true
	);
	$scope.$watch(
		function() {
			return $scope.submitStatus;
		},
		function(newVal, oldVal) {
			$scope.submitStatus = newVal;
		},
		true
	);
	$scope.submit = function() {
		$scope.currentDocument['tenantid'] = 1;
		$scope.currentDocument['CONFIGS'][$scope.detailType]['rowschema'] = $scope.detailSelectedRowSchema;
		//console.log($scope.currentDocument);
		putDataInCouchbase("1|FEEDCONFIG", $scope.currentDocument, $routeParams, $scope, saveFeedConfigTypeLayout);
	};	
	getDocumentFromCouchbase("0|FEEDCONFIG", $routeParams, $scope, getFeedConfigTypeLayoutAvailable);
}

function getFeedConfigTypeLayoutAvailable($routeParams, $scope, data) {
	$scope.$apply(function(){
		$scope.currentDocument = data.document;
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
	});	
}

function saveFeedConfigTypeLayout($routeParams, $scope, data) {
	$scope.$apply(function(){
		data.document;
		$scope.submitStatus = true;
	});	
}

function anyMatchInArray (targetJsonArray, targetArray, checkerArray, attributeName) {
	var found = false;
	var foundCount = 0;
	var targetAttributeArray = jQuery.map( targetArray, function( a ) {
		return a[attributeName];
	});
	targetJsonArray = jQuery.map( checkerArray, function( a ) {
		return a[attributeName];
	});
	for (var i = 0, j = checkerArray.length; foundCount < targetAttributeArray.length && i < j; i++) {
		if (targetAttributeArray.indexOf(checkerArray[i][attributeName]) > -1) {
			foundCount++; 
		}
	}
	if (foundCount < targetArray.length)
		return false;
	else
		return true;
};
 
function putDataInCouchbase(key, putdata, $routeParams, $scope, callback){
	try	{
		var p =  {
		   bucket: "default",
		   key: key,
		   post: {
			 value: putdata,
			 options: {}
		   }
		 }
	
		$.ajax({
			type: 'PUT',
			url: 'http://localhost:3000/default/s/' + key,
			data: JSON.stringify(p),
			contentType: 'application/json',
			dataType: 'json',
			success: function(msg) {
				console.log( msg );
			}
		})	
		.done(function(jd) {
			callback($routeParams, $scope, jd);
		})
		.fail(function() {
			console.log("put error");
		})
		.always(function() {
			console.log("put complete");
		});
	}
	catch(ex) {
		console.log(ex)
	}
}

function getDocumentFromCouchbase(key, $routeParams, $scope, callback){
	try
	{
		$.getJSON('http://localhost:3000/default/' + key, function(data) {
		})
		.done(function(jd) {
			callback($routeParams, $scope, jd);
		})
		.fail(function() {
			console.log("get error");
		})
		.always(function() {
			console.log("get complete");
		});
	}
	catch(ex)
	{
		console.log(ex)
	}
}

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