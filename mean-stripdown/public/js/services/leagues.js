window.angular.module('ngff.services.leagues', [])
    .factory('Leagues', ['$resource',
    function($resource){
        return $resource('leagues/:leaguedId',
            {
                leagueId: '@_id'
            },
            {
                update: {method: 'PUT'}
            })
    }]);