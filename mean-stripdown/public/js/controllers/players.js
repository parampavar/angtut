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

            $scope.limitct = 10;
            $scope.myDefs = [{ field: 'firstname', displayName: 'First Name', width: "*", resizable: false},
                { field: 'lastname', displayName: 'Last Name', width: "*" },
                { field: 'team', displayName: 'Team', width: "*" },
                { field: 'num', displayName: 'Number', width: "*" },
                { field: 'pos', displayName: 'Position', width: "*" }
            ];

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
                $scope.myData = pagedData;
                $scope.totalServerItems = data.length;
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.getPagedDataAsync = function (pageSize, page, searchText) {
                setTimeout(function () {
                    var data;
                    if ($scope.players)
                        $scope.find();
                    else
                        $scope.find();
                    if (searchText) {
                        var ft = searchText.toLowerCase();
                        //$http.get('largeLoad.json').success(function (largeLoad) {
                            data = $scope.players.filter(function(item) {
                                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                            });
                            $scope.setPagingData(data,page,pageSize);
                        //});
                    } else {
                        //$http.get('largeLoad.json').success(function (largeLoad) {
                            $scope.setPagingData($scope.players,page,pageSize);
                        //});
                    }
                }, 100);
            };

            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

            $scope.$watch('pagingOptions', function (newVal, oldVal) {
                if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                }
            }, true);
            $scope.$watch('filterOptions', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
                }
            }, true);

            $scope.gridOptions = {
                data: 'players',
                enablePaging: true,
                showFooter: true,
                columnDefs: 'myDefs',
                totalServerItems:'totalServerItems',
                pagingOptions: $scope.pagingOptions,
                filterOptions: $scope.filterOptions
            };

        }]);