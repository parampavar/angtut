//PlayerPositions, playerpositions
window.angular.module('ngff.services.PlayerPositions', [])
    .factory('PlayerPositions', ['$resource',
    function($resource){
        return $resource('playerpositions/:playerpositionId',
            {
                playerpositionId: '@_id'
            })
    }]);