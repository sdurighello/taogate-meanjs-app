'use strict';

//Setting up route
angular.module('log-general-setup').config(['$stateProvider',
	function($stateProvider) {
		// Log general setup state routing
		$stateProvider.
		state('log-general-setup', {
			url: '/log-general-setup',
			templateUrl: 'modules/log-general-setup/views/log-general-setup.client.view.html'
		});
	}
]);