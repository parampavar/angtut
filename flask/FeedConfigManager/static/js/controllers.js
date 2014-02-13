'use strict';

/* Controllers */

function IndexController($scope) {
}


function PostDetailController($scope, $routeParams, Post) {
	alert("Inside Post Detail Controller");
	var postQuery = Post.get({ postId: $routeParams.postId }, function(post) {
		$scope.post = post;
	});
}
