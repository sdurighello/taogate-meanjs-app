'use strict';

//Setting up route
angular.module('people-project-roles').config(['$stateProvider',
	function($stateProvider) {
		// People project roles state routing
		$stateProvider.
		state('listPeopleProjectRoles', {
			url: '/people-project-roles',
			templateUrl: 'modules/people-project-roles/views/list-people-project-roles.client.view.html'
		}).
		state('createPeopleProjectRole', {
			url: '/people-project-roles/create',
			templateUrl: 'modules/people-project-roles/views/create-people-project-role.client.view.html'
		}).
		state('viewPeopleProjectRole', {
			url: '/people-project-roles/:peopleProjectRoleId',
			templateUrl: 'modules/people-project-roles/views/view-people-project-role.client.view.html'
		}).
		state('editPeopleProjectRole', {
			url: '/people-project-roles/:peopleProjectRoleId/edit',
			templateUrl: 'modules/people-project-roles/views/edit-people-project-role.client.view.html'
		});
	}
]);