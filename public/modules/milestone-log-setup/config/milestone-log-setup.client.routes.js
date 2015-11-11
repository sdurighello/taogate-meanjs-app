'use strict';

//Setting up route
angular.module('milestone-log-setup').config(['$stateProvider',
	function($stateProvider) {
		// Milestone log setup state routing
		$stateProvider.
		state('milestone-log-setup', {
			url: '/milestone-log-setup',
			templateUrl: 'modules/milestone-log-setup/views/milestone-log-setup.client.view.html'
		});
	}
]);