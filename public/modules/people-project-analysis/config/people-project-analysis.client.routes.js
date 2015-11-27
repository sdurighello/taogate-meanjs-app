'use strict';

//Setting up route
angular.module('people-project-analysis').config(['$stateProvider',
	function($stateProvider) {
		// People project analysis state routing
		$stateProvider.
		state('people-project-analysis', {
			url: '/people-project-analysis',
			templateUrl: 'modules/people-project-analysis/views/people-project-analysis.client.view.html'
		});
	}
]);