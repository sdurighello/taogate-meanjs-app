'use strict';

//Setting up route
angular.module('project-statuses').config(['$stateProvider',
	function($stateProvider) {
		// Project statuses state routing
		$stateProvider.
		state('listProjectStatuses', {
			url: '/project-statuses',
			templateUrl: 'modules/project-statuses/views/list-project-statuses.client.view.html'
		}).
		state('createProjectStatus', {
			url: '/project-statuses/create',
			templateUrl: 'modules/project-statuses/views/create-project-status.client.view.html'
		}).
		state('viewProjectStatus', {
			url: '/project-statuses/:projectStatusId',
			templateUrl: 'modules/project-statuses/views/view-project-status.client.view.html'
		}).
		state('editProjectStatus', {
			url: '/project-statuses/:projectStatusId/edit',
			templateUrl: 'modules/project-statuses/views/edit-project-status.client.view.html'
		});
	}
]);