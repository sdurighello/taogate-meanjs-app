'use strict';

//Setting up route
angular.module('people-groups').config(['$stateProvider',
	function($stateProvider) {
		// People groups state routing
		$stateProvider.
		state('listPeopleGroups', {
			url: '/people-groups',
			templateUrl: 'modules/people-groups/views/list-people-groups.client.view.html'
		}).
		state('createPeopleGroup', {
			url: '/people-groups/create',
			templateUrl: 'modules/people-groups/views/create-people-group.client.view.html'
		}).
		state('viewPeopleGroup', {
			url: '/people-groups/:peopleGroupId',
			templateUrl: 'modules/people-groups/views/view-people-group.client.view.html'
		}).
		state('editPeopleGroup', {
			url: '/people-groups/:peopleGroupId/edit',
			templateUrl: 'modules/people-groups/views/edit-people-group.client.view.html'
		});
	}
]);