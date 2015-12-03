'use strict';

//Setting up route
angular.module('project-change-requests').config(['$stateProvider',
	function($stateProvider) {
		// Project change requests state routing
		$stateProvider.
		state('listProjectChangeRequests', {
			url: '/project-change-requests',
			templateUrl: 'modules/project-change-requests/views/list-project-change-requests.client.view.html'
		}).
		state('createProjectChangeRequest', {
			url: '/project-change-requests/create',
			templateUrl: 'modules/project-change-requests/views/create-project-change-request.client.view.html'
		}).
		state('viewProjectChangeRequest', {
			url: '/project-change-requests/:projectChangeRequestId',
			templateUrl: 'modules/project-change-requests/views/view-project-change-request.client.view.html'
		}).
		state('editProjectChangeRequest', {
			url: '/project-change-requests/:projectChangeRequestId/edit',
			templateUrl: 'modules/project-change-requests/views/edit-project-change-request.client.view.html'
		});
	}
]);