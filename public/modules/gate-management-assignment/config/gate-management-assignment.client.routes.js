'use strict';

//Setting up route
angular.module('gate-management-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Gate management assignment state routing
		$stateProvider.
		state('gate-management-assignment', {
			url: '/gate-management-assignment',
			templateUrl: 'modules/gate-management-assignment/views/gate-management-assignment.client.view.html'
		});
	}
]);