'use strict';

//Setting up route
angular.module('people-project-groups').config(['$stateProvider',
	function($stateProvider) {
		// People project groups state routing
		$stateProvider.
		state('listPeopleProjectGroups', {
			url: '/people-project-groups',
			templateUrl: 'modules/people-project-groups/views/list-people-project-groups.client.view.html'
		}).
		state('createPeopleProjectGroup', {
			url: '/people-project-groups/create',
			templateUrl: 'modules/people-project-groups/views/create-people-project-group.client.view.html'
		}).
		state('viewPeopleProjectGroup', {
			url: '/people-project-groups/:peopleProjectGroupId',
			templateUrl: 'modules/people-project-groups/views/view-people-project-group.client.view.html'
		}).
		state('editPeopleProjectGroup', {
			url: '/people-project-groups/:peopleProjectGroupId/edit',
			templateUrl: 'modules/people-project-groups/views/edit-people-project-group.client.view.html'
		});
	}
]);