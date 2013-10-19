window.angular.module('ngff.controllers.nfl', [])
    .controller('NFLController', ['$scope', '$routeParams', '$location', 'Global', 'NFLTeam',
        function($scope, $routeParams, $location, Global, NFLTeam){

            $scope.global = Global;
            $scope.find = function (query) {
                NFLTeam.query(query, function (nflteams) {
                    $scope.nflteams = nflteams;
                });
            };
            $scope.nflteams = $scope.find();
            $scope.findOne = function () {
                NFLTeam.get({ nflteamId: $routeParams.nflteamId }, function (nflteam) {
                    $scope.nflteam = nflteam;
                });
            };
            $scope.nflteam = $scope.findOne();
        }]);