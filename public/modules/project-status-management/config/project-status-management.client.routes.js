'use strict';

//Setting up route
angular.module('project-status-management').config(['$stateProvider',
	function($stateProvider) {
		// Project status management state routing
		$stateProvider.
		state('project-status-management', {
			url: '/project-status-management',
			templateUrl: 'modules/project-status-management/views/project-status-management.client.view.html'
		});
	}
]);