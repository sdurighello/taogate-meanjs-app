'use strict';

//Setting up route
angular.module('definition-dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Definition dashboards state routing
		$stateProvider.
		state('dashboard-prioritization', {
			url: '/dashboard-prioritization',
			templateUrl: 'modules/definition-dashboards/views/dashboard-prioritization.client.view.html'
		}).
		state('dashboard-categorization', {
			url: '/dashboard-categorization',
			templateUrl: 'modules/definition-dashboards/views/dashboard-categorization.client.view.html'
		});
	}
]);
