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
angular.module('FeedConfigManager', ['ngRoute'], 
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

function FeedConfigTypeListController($routeParams, $scope) {
	alert("Inside FeedConfigTypeListController Controller");
	var postsQuery = $.getJSON("http://localhost:3000/default/1|FEEDCONFIG", function(data) {
		$scope.feedconfigtypes = data;
	});
	
}