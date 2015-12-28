'use strict';

//Setting up route
angular.module('status-report-setup').config(['$stateProvider',
	function($stateProvider) {
		// Status report setup state routing
		$stateProvider.
		state('status-report-setup', {
			url: '/status-report-setup',
			templateUrl: 'modules/status-report-setup/views/status-report-setup.client.view.html'
		});
	}
]);