<<<<<<< HEAD
/*window.angular.module('ngff.controllers.nfl', [])
=======
/*
window.angular.module('ngff.controllers.nfl', [])
>>>>>>> NFL service not use hardcoded teams
    .controller('NFLController', ['$scope','$routeParams','Global','NFL',
    function($scope, $routeParams, Global, NFL) {
	console.log($scope);
    $scope.global = Global;
	$scope.nflteams = NFL.teams;
	$scope.nflteam = NFL.teams[$routeParams['nflTeamId']];
<<<<<<< HEAD
    }]);*/
window.angular.module('ngff.controllers.nfl', [])
    .controller('NFLController', ['$scope','$routeParams','Global','NFLTeam',
        function($scope, $routeParams, Global, NFLTeam) {
            console.log($scope);
            $scope.global = Global;
            $scope.nflteams = NFLTeam.teams;
            $scope.nflteam = NFLTeam.teams[$routeParams['nflTeamId']];
=======
     
    }]);
*/

window.angular.module('ngff.controllers.nfl', [])
    .controller('NFLController', ['$scope', '$routeParams', '$location', 'Global', 'NFLTeams',
        function($scope, $routeParams, $location, Global, NFLTeams){

            $scope.global = Global;
            $scope.find = function (query) {
                NFLTeams.query(query, function (nflteams) {
                    $scope.nflteams = nflteams;
                });
            };
            $scope.nflteams = $scope.find();
            $scope.findOne = function () {
                NFLTeams.get({ nflteamId: $routeParams.nflteamId }, function (nflteam) {
                    $scope.nflteam = nflteam;
                });
            };
            $scope.nflteam = $scope.findOne();
>>>>>>> NFL service not use hardcoded teams
        }]);