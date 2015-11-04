'use strict';

//Setting up route
angular.module('priority-setup').config(['$stateProvider',
	function($stateProvider) {
		// Priority setup state routing
		$stateProvider.
		state('priority-setup', {
			url: '/priority-setup',
			templateUrl: 'modules/priority-setup/views/priority-setup.client.view.html'
		});
	}
]);