window.angular.module('ngff.services.FantasyTeams', [])
    .factory('FantasyTeams', ['$resource',
    function($resource){
        return $resource('fantasyteams/:fantasyteamId',
            {
                leagueId: '@_id'
            },
            {
                update: {method: 'PUT'}
            })
    }]);