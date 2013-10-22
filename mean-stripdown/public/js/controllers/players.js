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

            $scope.find = function (query) {
                $scope.fnnflteams();
                $scope.fnplayerpositions();
                Players.query(query, function (players) {
                    $scope.players = players;
                    //return players;
                });
            };

            $scope.myDefs = [{ field: 'firstname', displayName: 'First Name', width: "*", resizable: false},
                { field: 'lastname', displayName: 'Last Name', width: "*" },
                { field: 'team', displayName: 'Team', width: "*" },
                { field: 'num', displayName: 'Number', width: "*" },
                { field: 'pos', displayName: 'Position', width: "*" }
            ];

            $scope.SelectTeamFilter = function(team){
                console.log(team.JSON);
            };

            $scope.filterOptions = {
                filterText: "",
                useExternalFilter: true
            };
            $scope.totalServerItems = 0;
            $scope.pagingOptions = {
                pageSizes: [5, 10, 20],
                pageSize: 5,
                currentPage: 1
            };
            $scope.setPagingData = function(data, page, pageSize){
                var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
                $scope.playerspagedData = pagedData;
                $scope.totalServerItems = data.length;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.getPagedDataAsync = function (searchOption, pageSize, page, searchText) {
                setTimeout(function () {
                    var data;
                    if (searchText && searchOption) {
                        var ft = searchText.toLowerCase();
                        data = $scope.players.filter(function (item) {
                            if (searchOption == 'search.team')
                                return item.team == searchText;
                            else if (searchOption == 'search.pos')
                                return item.pos == searchText;
                            else
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            $scope.setPagingData(data,page,pageSize);
                    } else {
                            $scope.setPagingData($scope.players,page,pageSize);
                    }
                }, 100);
            };

            $scope.$watch('pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
                    $scope.getPagedDataAsync('pagingOptions', $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                }
            }, true);
            $scope.$watch('search.firstname', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.getPagedDataAsync('search.firstname', $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, newVal);
                }
            }, true);
            $scope.$watch('players', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.getPagedDataAsync('players', $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                }
            }, true);
            $scope.$watch('search.team', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.getPagedDataAsync('search.team', $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, newVal);
                }
            }, true);
            $scope.$watch('search.pos', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.getPagedDataAsync('search.pos', $scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, newVal);
                }
            }, true);

            $scope.gridOptions = {
                data: 'playerspagedData',
                enablePaging: true,
                showFooter: true,
                columnDefs: 'myDefs',
                totalServerItems: 'totalServerItems',
                pagingOptions: $scope.pagingOptions,
                filterOptions: $scope.filterOptions
            };

            $scope.find();

        }]);