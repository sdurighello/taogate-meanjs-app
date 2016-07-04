'use strict';

//Setting up route
angular.module('project-status-updates').config(['$stateProvider',
	function($stateProvider) {
		// Project status management state routing
		$stateProvider.
		state('project-status-updates', {
			url: '/project-status-updates',
			templateUrl: 'modules/project-status-updates/views/project-status-updates.client.view.html'
		})
        .state('project-status-updates-id', {
            url: '/project-status-updates/:projectStatusUpdateId/projects/:projectId/gates/:gateId',
            templateUrl: 'modules/project-status-updates/views/project-status-updates.client.view.html'
        });
	}
]);
