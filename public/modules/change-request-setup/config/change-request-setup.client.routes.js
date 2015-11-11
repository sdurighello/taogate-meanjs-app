'use strict';

//Setting up route
angular.module('change-request-setup').config(['$stateProvider',
	function($stateProvider) {
		// Change request setup state routing
		$stateProvider.
		state('change-request-setup', {
			url: '/change-request-setup',
			templateUrl: 'modules/change-request-setup/views/change-request-setup.client.view.html'
		});
	}
]);