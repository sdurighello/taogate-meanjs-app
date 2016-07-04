'use strict';

//Setting up route
angular.module('project-change-requests').config(['$stateProvider',
	function($stateProvider) {
		// Project change requests state routing
		$stateProvider.
		state('ProjectChangeRequests', {
			url: '/project-change-requests',
			templateUrl: 'modules/project-change-requests/views/project-change-requests.client.view.html'
		})
            // Route required from myTao
        .state('project-change-requests-id', {
            url: '/project-change-requests/:projectChangeRequestId/projects/:projectId/gates/:gateId',
            templateUrl: 'modules/project-change-requests/views/project-change-requests.client.view.html'
        });
	}
]);
