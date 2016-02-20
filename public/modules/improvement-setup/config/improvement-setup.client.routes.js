'use strict';

//Setting up route
angular.module('improvement-setup').config(['$stateProvider',
	function($stateProvider) {
		// Improvement setup state routing
		$stateProvider.
		state('improvement-setup', {
			url: '/improvement-setup',
			templateUrl: 'modules/improvement-setup/views/improvement-setup.client.view.html'
		});
	}
]);