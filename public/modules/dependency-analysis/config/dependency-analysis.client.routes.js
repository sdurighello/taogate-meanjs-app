'use strict';

//Setting up route
angular.module('dependency-analysis').config(['$stateProvider',
	function($stateProvider) {
		// Dependency analysis state routing
		$stateProvider.
		state('dependency-analysis', {
			url: '/dependency-analysis',
			templateUrl: 'modules/dependency-analysis/views/dependency-analysis.client.view.html'
		});
	}
]);