'use strict';

//Setting up route
angular.module('portfolio-reviews').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio reviews state routing
		$stateProvider.
		state('portfolio-reviews', {
			url: '/portfolio-reviews',
			templateUrl: 'modules/portfolio-reviews/views/portfolio-reviews.client.view.html'
		});
	}
]);
