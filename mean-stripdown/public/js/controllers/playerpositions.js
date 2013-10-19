//PlayerPositions, playerpositions
window.angular.module('ngff.controllers.PlayerPositions', [])
    .controller('PlayerPositionsController', ['$scope', '$routeParams', '$location', 'Global', 'PlayerPositions',
        function($scope, $routeParams, $location, Global, PlayerPositions){
            $scope.global = Global;

            $scope.global = Global;
            $scope.find = function (query) {
                PlayerPositions.query(query, function (playerpositions) {
                    $scope.playerpositions = playerpositions;
                });
            };
            $scope.fnplayerpositions = $scope.find();
            $scope.findOne = function () {
                PlayerPositions.get({ playerpositionId: $routeParams.playerpositionId }, function (playerposition) {
                    $scope.playerposition = playerposition;
                });
            };
            $scope.fnplayerposition = $scope.findOne();

        }]);