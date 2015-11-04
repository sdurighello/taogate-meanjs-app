'use strict';

//Setting up route
angular.module('people-setup').config(['$stateProvider',
	function($stateProvider) {
		// People setup state routing
		$stateProvider.
		state('people-setup', {
			url: '/people-setup',
			templateUrl: 'modules/people-setup/views/people-setup.client.view.html'
		});
	}
]);