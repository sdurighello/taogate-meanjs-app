'use strict';

//Setting up route
angular.module('priority-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Priority assignment state routing
		$stateProvider.
		state('priority-assignment', {
			url: '/priority-assignment',
			templateUrl: 'modules/priority-assignment/views/priority-assignment.client.view.html'
		});
	}
]);