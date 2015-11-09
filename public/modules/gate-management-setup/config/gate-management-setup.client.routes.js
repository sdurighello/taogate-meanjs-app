'use strict';

//Setting up route
angular.module('gate-management-setup').config(['$stateProvider',
	function($stateProvider) {
		// Gate management setup state routing
		$stateProvider.
		state('gate-management-setup', {
			url: '/gate-management-setup',
			templateUrl: 'modules/gate-management-setup/views/gate-management-setup.client.view.html'
		});
	}
]);