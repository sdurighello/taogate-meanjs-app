'use strict';

//Setting up route
angular.module('portfolio-issues').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio issues state routing
		$stateProvider.
		state('portfolio-issues', {
			url: '/portfolio-issues',
			templateUrl: 'modules/portfolio-issues/views/portfolio-issues.client.view.html'
		});
	}
]);
