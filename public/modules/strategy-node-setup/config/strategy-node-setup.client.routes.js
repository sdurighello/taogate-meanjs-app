'use strict';

//Setting up route
angular.module('strategy-node-setup').config(['$stateProvider',
	function($stateProvider) {
		// Strategy node setup state routing
		$stateProvider.
		state('strategy-node-setup', {
			url: '/strategy-node-setup',
			templateUrl: 'modules/strategy-node-setup/views/strategy-node-setup.client.view.html'
		});
	}
]);