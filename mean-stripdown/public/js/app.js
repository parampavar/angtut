window.app = angular.module('ngFantasyFootball', ['ngCookies', 'ngResource', 'ui.bootstrap', 'ngRoute', 'ngff.controllers', 'ngff.directives', 'ngff.services']);

// bundling dependencies
window.angular.module('ngff.controllers', ['ngff.controllers.header','ngff.controllers.index', 'ngff.controllers.leagues', 'ngff.controllers.NFLTeams', 'ngff.controllers.PlayerPositions', 'ngff.controllers.players']);
window.angular.module('ngff.services', ['ngff.services.global', 'ngff.services.leagues', 'ngff.services.NFLTeams', 'ngff.services.PlayerPositions', 'ngff.services.players']);