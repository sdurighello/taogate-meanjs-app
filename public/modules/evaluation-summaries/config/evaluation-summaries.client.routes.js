'use strict';

//Setting up route
angular.module('evaluation-summaries').config(['$stateProvider',
	function($stateProvider) {
		// Evaluation summaries state routing
		$stateProvider.
		state('portfolio-evaluation-summary', {
			url: '/portfolio-evaluation-summary',
			templateUrl: 'modules/evaluation-summaries/views/portfolio-summary.client.view.html'
		});
	}
]);
