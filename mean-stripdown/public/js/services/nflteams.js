window.angular.module('ngff.services.NFLTeam', [])
    .factory('NFLTeam', ['$resource', 'NFLTeam',
    function($resource, NFLTeam){
        return $resource('nflteams/:nflteamId',
            {
                nflteamId: '@_id'
            }),
            teams([{"abbr":"ARI", "team":"Arizona", "mascot": "Cardinals", "conference":"NFC", "division": "West"}])

    }]);