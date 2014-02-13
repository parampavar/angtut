'use strict';

/* Controllers */

function IndexController($scope) {
}

function AboutController($scope, $routeParams) {
	$scope.aboutname = $routeParams.name;
}



function PostDetailController($scope, $routeParams, Post) {
	alert("Inside Post Detail Controller");
	var postQuery = Post.get({ postId: $routeParams.postId }, function(post) {
		$scope.post = post;
	});
}
