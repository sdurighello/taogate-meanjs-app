'use strict';

//Setting up route
angular.module('portfolio-setup').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio setup state routing
		$stateProvider.
		state('portfolio-setup', {
			url: '/portfolio-setup',
			templateUrl: 'modules/portfolio-setup/views/portfolio-setup.client.view.html'
		});
	}
]);