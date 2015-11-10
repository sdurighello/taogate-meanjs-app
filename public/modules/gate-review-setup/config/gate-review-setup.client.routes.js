'use strict';

//Setting up route
angular.module('gate-review-setup').config(['$stateProvider',
	function($stateProvider) {
		// Gate review setup state routing
		$stateProvider.
		state('gate-review-setup', {
			url: '/gate-review-setup',
			templateUrl: 'modules/gate-review-setup/views/gate-review-setup.client.view.html'
		});
	}
]);