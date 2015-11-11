'use strict';

//Setting up route
angular.module('log-milestone-setup').config(['$stateProvider',
	function($stateProvider) {
		// Log milestone setup state routing
		$stateProvider.
		state('log-milestone-setup', {
			url: '/log-milestone-setup',
			templateUrl: 'modules/log-milestone-setup/views/log-milestone-setup.client.view.html'
		});
	}
]);