window.angular.module('ngff.services.NFLTeams', [])
    .factory('NFLTeams', ['$resource',
    function($resource){
        return $resource('nflteams/:nflteamId',
            {
                nflteamId: '@_id'
            })
    }]);