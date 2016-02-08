'use strict';

//Setting up route
angular.module('portfolio-review-templates').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio review templates state routing
		$stateProvider.
		state('portfolio-review-templates', {
			url: '/portfolio-review-templates',
			templateUrl: 'modules/portfolio-review-templates/views/portfolio-review-templates.client.view.html'
		});
	}
]);