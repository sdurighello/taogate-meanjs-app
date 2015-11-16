'use strict';

//Setting up route
angular.module('portfolio-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio assignment state routing
		$stateProvider.
		state('portfolio-assignment', {
			url: '/portfolio-assignment',
			templateUrl: 'modules/portfolio-assignment/views/portfolio-assignment.client.view.html'
		});
	}
]);