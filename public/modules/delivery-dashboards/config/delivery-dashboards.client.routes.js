'use strict';

//Setting up route
angular.module('delivery-dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Delivery dashboards state routing
		$stateProvider.
		state('dashboard-performances', {
			url: '/dashboard-performances',
			templateUrl: 'modules/delivery-dashboards/views/dashboard-performances.client.view.html'
		});
	}
]);
