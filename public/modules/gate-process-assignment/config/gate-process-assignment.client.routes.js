'use strict';

//Setting up route
angular.module('gate-process-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Gate management assignment state routing
		$stateProvider.
		state('gate-process-assignment', {
			url: '/gate-process-assignment',
			templateUrl: 'modules/gate-process-assignment/views/gate-process-assignment.client.view.html'
		});
	}
]);
