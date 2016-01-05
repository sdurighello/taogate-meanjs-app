'use strict';

//Setting up route
angular.module('project-issues').config(['$stateProvider',
	function($stateProvider) {
		// Project issues state routing
		$stateProvider.
		state('project-issues', {
			url: '/project-issues',
			templateUrl: 'modules/project-issues/views/project-issues.client.view.html'
		});
	}
]);
