'use strict';

//Setting up route
angular.module('gate-performances').config(['$stateProvider',
	function($stateProvider) {
		// Delivery dashboards state routing
		$stateProvider.
		state('gate-performances-portfolio', {
			url: '/gate-performances-portfolio',
			templateUrl: 'modules/gate-performances/views/gate-performances-portfolio.client.view.html'
		}).
		state('gate-performances-project', {
			url: '/gate-performances-project',
			templateUrl: 'modules/gate-performances/views/gate-performances.client.view.html'
		});
	}
]);
