window.angular.module('ngff.controllers.FantasyTeams', [])
    .controller('LeaguesController', ['$scope', '$routeParams', '$location', 'Global', 'Leagues','FantasyTeams',
        function($scope, $routeParams, $location, Global, Leagues, FantasyTeams){
            $scope.global = Global;

            $scope.populateLeagues = function(query){
                Leagues.query(query, function(leagues){
                    $scope.leagues = leagues;
                });
            };

            $scope.create = function(){
                var fantasyteam = new FantasyTeams({
                    name: this.fantasyteam.name,
                    league: this.fantasyteam.league,
                    players: this.fantasyteam.players
                });
                fantasyteam.$save (function(response){
                    $location.path('fantasyteams/' + response._id);
                });
                this.league = '';
                this.name = '';
                this.players = [];
            };

            $scope.update = function () {
                var fantasyteam = $scope.fantasyteam;
                fantasyteam.$update(function () {
                    $location.path('fantasyteams/' + fantasyteam._id);
                });
            };

            $scope.find = function (query) {
                FantasyTeams.query(query, function (fantasyteams) {
                    $scope.fantasyteams = fantasyteams;
                });
            };

            $scope.findOne = function () {
                FantasyTeams.get({ fantasyteamId: $routeParams.fantasyteamId }, function (fantasyteam) {
                    $scope.fantasyteam = fantasyteam;
                });
            };

            $scope.destroy = function (fantasyteam) {
                fantasyteam.$remove();
                for (var i in $scope.fantasyteams) {
                    if ($scope.fantasyteams[i] == fantasyteam) {
                        $scope.fantasyteams.splice(i, 1)
                    }
                }
            };
        }]);