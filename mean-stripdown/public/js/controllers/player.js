//players, players
window.angular.module('ngff.controllers.players', [])
    .controller('PlayersController', ['$scope', '$routeParams', '$location', 'Global', 'NFLTeams', 'PlayerPositions',
        function($scope, $routeParams, $location, Global, NFLTeams, PlayerPositions){
            $scope.global = Global;

            $scope.PlayerPositions = function (query) {
                PlayerPositions.query(query, function (playerpositions) {
                    return playerpositions;
                });
            };

            $scope.NFLTeams = function (query) {
                NFLTeams.query(query, function (nflteams) {
                    return nflteams;
                });
            };
            $scope.limitct = 10;
        }]);