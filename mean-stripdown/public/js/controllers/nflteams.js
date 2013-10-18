window.angular.module('ngff.controllers.NFLTeam', [])
    .controller('NFLTeamsController', ['$scope', '$routeParams', '$location', 'Global', 'NFLTeams',
        function($scope, $routeParams, $location, Global, NFLTeams){
            $scope.global = Global;

            $scope.find = function (query) {
                NFLTeams.query(query, function (nflteams) {
                    $scope.nflteams = nflteams;
                });
            };

            $scope.findOne = function () {
                NFLTeams.get({ nflteamId: $routeParams.nflteamId }, function (nflteam) {
                    $scope.nflteam = nflteam;
                });
            };

        }]);