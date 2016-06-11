'use strict';

//Setting up route
angular.module('portfolio-status-reports').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio status reports state routing
		$stateProvider.
		state('portfolio-status-reports', {
			url: '/portfolio-status-reports',
			templateUrl: 'modules/portfolio-status-reports/views/portfolio-status-reports.client.view.html'
		});
	}
]);
