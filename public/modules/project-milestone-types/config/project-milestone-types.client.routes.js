'use strict';

//Setting up route
angular.module('project-milestone-types').config(['$stateProvider',
	function($stateProvider) {
		// Project milestone types state routing
		$stateProvider.
		state('listProjectMilestoneTypes', {
			url: '/project-milestone-types',
			templateUrl: 'modules/project-milestone-types/views/list-project-milestone-types.client.view.html'
		}).
		state('createProjectMilestoneType', {
			url: '/project-milestone-types/create',
			templateUrl: 'modules/project-milestone-types/views/create-project-milestone-type.client.view.html'
		}).
		state('viewProjectMilestoneType', {
			url: '/project-milestone-types/:projectMilestoneTypeId',
			templateUrl: 'modules/project-milestone-types/views/view-project-milestone-type.client.view.html'
		}).
		state('editProjectMilestoneType', {
			url: '/project-milestone-types/:projectMilestoneTypeId/edit',
			templateUrl: 'modules/project-milestone-types/views/edit-project-milestone-type.client.view.html'
		});
	}
]);