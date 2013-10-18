/*window.angular.module('ngff.controllers.nfl', [])
    .controller('NFLController', ['$scope','$routeParams','Global','NFL',
    function($scope, $routeParams, Global, NFL) {
	console.log($scope);
    $scope.global = Global;
	$scope.nflteams = NFL.teams;
	$scope.nflteam = NFL.teams[$routeParams['nflTeamId']];
    }]);*/
window.angular.module('ngff.controllers.nfl', [])
    .controller('NFLController', ['$scope','$routeParams','Global','NFLTeam',
        function($scope, $routeParams, Global, NFLTeam) {
            console.log($scope);
            $scope.global = Global;
            $scope.nflteams = NFLTeam.teams;
            $scope.nflteam = NFLTeam.teams[$routeParams['nflTeamId']];
        }]);