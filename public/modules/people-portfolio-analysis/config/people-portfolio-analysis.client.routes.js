'use strict';

//Setting up route
angular.module('people-portfolio-analysis').config(['$stateProvider',
	function($stateProvider) {
		// People portfolio analysis state routing
		$stateProvider.
		state('people-portfolio-analysis', {
			url: '/people-portfolio-analysis',
			templateUrl: 'modules/people-portfolio-analysis/views/people-portfolio-analysis.client.view.html'
		});
	}
]);