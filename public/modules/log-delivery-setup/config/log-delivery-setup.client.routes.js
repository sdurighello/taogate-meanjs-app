'use strict';

//Setting up route
angular.module('log-delivery-setup').config(['$stateProvider',
	function($stateProvider) {
		// Log delivery setup state routing
		$stateProvider.
		state('log-delivery-setup', {
			url: '/log-delivery-setup',
			templateUrl: 'modules/log-delivery-setup/views/log-delivery-setup.client.view.html'
		});
	}
]);