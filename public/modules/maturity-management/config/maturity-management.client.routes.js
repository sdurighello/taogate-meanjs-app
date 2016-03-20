'use strict';

//Setting up route
angular.module('maturity-management').config(['$stateProvider',
	function($stateProvider) {
		// Maturity management state routing
		$stateProvider.
		state('maturity-management', {
			url: '/maturity-management',
			templateUrl: 'modules/maturity-management/views/maturity-management.client.view.html'
		});
	}
]);