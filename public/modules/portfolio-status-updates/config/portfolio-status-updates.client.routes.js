'use strict';

//Setting up route
angular.module('portfolio-status-updates').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio status updates state routing
		$stateProvider.
		state('portfolio-status-updates', {
			url: '/portfolio-status-updates',
			templateUrl: 'modules/portfolio-status-updates/views/portfolio-status-updates.client.view.html'
		});
	}
]);
