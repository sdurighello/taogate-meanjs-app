'use strict';

//Setting up route
angular.module('maturity-setup').config(['$stateProvider',
	function($stateProvider) {
		// Maturity setup state routing
		$stateProvider.
		state('maturity-setup', {
			url: '/maturity-setup',
			templateUrl: 'modules/maturity-setup/views/maturity-setup.client.view.html'
		});
	}
]);