'use strict';

//Setting up route
angular.module('portfolio-ranking-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio ranking assignment state routing
		$stateProvider.
		state('portfolio-ranking-assignment', {
			url: '/portfolio-ranking-assignment',
			templateUrl: 'modules/portfolio-ranking-assignment/views/portfolio-ranking-assignment.client.view.html'
		});
	}
]);