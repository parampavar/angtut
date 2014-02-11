/*
angular.module('FeedConfigManager', ['ui.bootstrap']);
function AlertDemoCtrl($scope) {
  $scope.alerts = [
    { type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
    { type: 'success', msg: 'Well done! You successfully read this important alert message.' }
  ];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: "Another alert!"});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

}
*/
angular.module('FeedConfigManager', ['ngRoute', 'ngGrid'], 
	function($routeProvider, $locationProvider) {
	$routeProvider.when('/', {
//		templateUrl: 'static/partials/show_feedconfigtypes.html',
//		controller: FeedConfigTypeListController
		templateUrl: 'static/partials/landing.html',
		controller: IndexController
	});
	$routeProvider.when('/about', {
		templateUrl: 'static/partials/about.html',
		controller: AboutController
	});
	$routeProvider.when('/feedconfigtype', {
		templateUrl: 'static/partials/show_feedconfigtypes.html',
		controller: FeedConfigTypeListController
	});
	$routeProvider.when('/feedconfigtype/layout/:type_name', {
		templateUrl: 'static/partials/show_feedconfigtype_layout.html',
		controller: FeedConfigTypeLayoutController
	});
	$routeProvider.when('/feedconfigtype/:postId', {
		templateUrl: '/static/partials/post-detail.html',
		controller: PostDetailController
	});
	/* Create a "/blog" route that takes the user to the same place as "/feedconfigtype" */
	$routeProvider.when('/blog', {
		templateUrl: 'static/partials/show_feedconfigtypes.html',
		controller: FeedConfigTypeListController
	});

	$locationProvider.html5Mode(true);
});

function MainCntl($route, $routeParams, $location) {
  this.$route = $route;
  this.$location = $location;
  this.$routeParams = $routeParams;
}

function FeedConfigTypeLayoutController($routeParams, $scope) {
	$scope.feedconfigtypelayout = {};
	$scope.feedConfigTypeLayoutAvailableGridOptions = {};
	$scope.feedConfigTypeLayoutSelectedGridOptions = {};
	
	
}

function FeedConfigTypeListController($routeParams, $scope) {
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
			{field:'editlayout', displayName: '', cellTemplate: '<div class="ngCellText"><a ng-href="/#/feedconfigtype/layout/{{row.entity.type}}">Edit</a></div>'}
			]
		};
 
	
	try
	{
	$.getJSON('http://localhost:3000/default/1|FEEDCONFIG', function(data) {
	//$.getJSON('http://localhost:3000/default/1|FEEDCONFIG?callback=?', function() {
		//console.log("success");
		//console.log(data);
	})
	.done(function(jd) {
		$scope.$apply(function(){
			$scope.abcd = 'Param Pavar';
			
			$scope.feedconfigtypes = jd.document['CONFIGS'];
			feedConfigTypesArray = jQuery.map( $scope.feedconfigtypes, function( a ) {
				return a;
			});
			$scope.feedconfigtypes = feedConfigTypesArray;
			$scope.feedConfigTypeGridOptions = { data: 'feedconfigtypes' };
			
	/*
	var jfct = { "CUSTOMER":{ "updatedby":"Koochi", "description":"Customer Feed file2", "type":"CUSTOMER", "createdby":"Param", "name":"CUSTOMER" }, "SURGEON":{ "name":"SURGEON", "createdby":"Param", "type":"SURGEON", "updatedby":"Param", "description":"Surgeon Master File" } };
	feedConfigTypesArray = jQuery.map( jfct, function( a ) {
		return a;
	});
	// var jsonstr = JSON.stringify(feedConfigTypesArray);
	// var jsonArr = JSON.parse(jsonstr);
	console.log('jfct');
	console.log(jfct);
	console.log('feedConfigTypesArray');
	console.log(feedConfigTypesArray);
	// console.log('jsonstr');
	// console.log(jsonstr);
	// console.log('jsonArr');
	// console.log(jsonArr);
	$scope.feedconfigtypes = feedConfigTypesArray;
	$scope.feedConfigTypeGridOptions = { data: 'feedconfigtypes' };
	*/
        });	
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
	
	/*
	console.log(">>>>>>>>>>>>>>>");
	(function($) {
		var url = 'http://www.jquery4u.com/scripts/jquery4u.settings.json';	
		url = 'http://api.stackoverflow.com/1.0/tags/';
		url = 'http://localhost:3000/default/1|FEEDCONFIG';
		$.ajax({
			type:'GET', dataType:'jsonp', 
			jsonp:'onJSONPLoad', jsonpCallback:'aaaa',
			url: url,
			//success:function(data) {
			//	alert(data);
			//},
			error:function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR.readyState);
				console.log(jqXHR.status);
				console.log(jqXHR.statusText);
				console.log(jqXHR.responseXML);
				console.log(jqXHR.responseText);
				console.log("Sorry, I can't get the feed");  
			},
			complete:function() {console.log("Completed"); }
		});
	})(jQuery);	
	console.log("<<<<<<<<<<<<<<");
	*/
	/*
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true); //Open the XHR request. Will be sent later
	xhr.onreadystatechange = function (event) {
		pm.request.response.load(event.target);
	};
	*/
//	alert('post');

/*
	console.log(">>>>>>>>>>>>>>>");
	makeCorsRequest();
	console.log("<<<<<<<<<<<<<<");
*/
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