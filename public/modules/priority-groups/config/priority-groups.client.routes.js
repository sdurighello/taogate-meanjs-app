'use strict';

//Setting up route
angular.module('priority-groups').config(['$stateProvider',
	function($stateProvider) {
		// Priority groups state routing
		$stateProvider.
		state('listPriorityGroups', {
			url: '/priority-groups',
			templateUrl: 'modules/priority-groups/views/list-priority-groups.client.view.html'
		}).
		state('createPriorityGroup', {
			url: '/priority-groups/create',
			templateUrl: 'modules/priority-groups/views/create-priority-group.client.view.html'
		}).
		state('viewPriorityGroup', {
			url: '/priority-groups/:priorityGroupId',
			templateUrl: 'modules/priority-groups/views/view-priority-group.client.view.html'
		}).
		state('editPriorityGroup', {
			url: '/priority-groups/:priorityGroupId/edit',
			templateUrl: 'modules/priority-groups/views/edit-priority-group.client.view.html'
		});
	}
]);