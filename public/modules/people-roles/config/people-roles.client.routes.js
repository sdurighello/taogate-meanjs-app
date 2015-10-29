'use strict';

//Setting up route
angular.module('people-roles').config(['$stateProvider',
	function($stateProvider) {
		// People roles state routing
		$stateProvider.
		state('listPeopleRoles', {
			url: '/people-roles',
			templateUrl: 'modules/people-roles/views/list-people-roles.client.view.html'
		}).
		state('createPeopleRole', {
			url: '/people-roles/create',
			templateUrl: 'modules/people-roles/views/create-people-role.client.view.html'
		}).
		state('viewPeopleRole', {
			url: '/people-roles/:peopleRoleId',
			templateUrl: 'modules/people-roles/views/view-people-role.client.view.html'
		}).
		state('editPeopleRole', {
			url: '/people-roles/:peopleRoleId/edit',
			templateUrl: 'modules/people-roles/views/edit-people-role.client.view.html'
		});
	}
]);