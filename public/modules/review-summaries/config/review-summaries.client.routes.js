'use strict';

//Setting up route
angular.module('review-summaries').config(['$stateProvider',
	function($stateProvider) {
		// Review summaries state routing
		$stateProvider.
		state('review-summaries', {
			url: '/review-summaries',
			templateUrl: 'modules/review-summaries/views/portfolio-review-summary.client.view.html'
		});
	}
]);
