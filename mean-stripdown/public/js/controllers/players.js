//players, players
window.angular.module('ngff.controllers.players', [])
    .controller('PlayersController', ['$scope', '$routeParams', '$location', 'Global', 'NFLTeams', 'PlayerPositions', 'Players',
        function($scope, $routeParams, $location, Global, NFLTeams, PlayerPositions, Players){
            $scope.global = Global;

            $scope.fnplayerpositions = function (query) {
                PlayerPositions.query(query, function (playerpositions) {
                    $scope.playerpositions = playerpositions;
                });
            };

            $scope.fnnflteams = function (query) {
                NFLTeams.query(query, function (nflteams) {
                    $scope.nflteams = nflteams;
                });
            };
            $scope.limitct = 10;

            $scope.find = function (query) {
                $scope.fnnflteams();
                $scope.fnplayerpositions();
                Players.query(query, function (players) {
                    $scope.players = players;
                    //return players;
                });
            };

        }]);