'use strict';

//Setting up route
angular.module('dependency-analysis').config(['$stateProvider',
	function($stateProvider) {
		// Dependency analysis state routing
		$stateProvider.
		state('project-dependency', {
			url: '/project-dependency',
			templateUrl: 'modules/dependency-analysis/views/project-dependency.client.view.html'
		}).
		state('dependency-analysis', {
			url: '/dependency-analysis',
			templateUrl: 'modules/dependency-analysis/views/dependency-analysis.client.view.html'
		});
	}
]);
