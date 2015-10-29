'use strict';

//Setting up route
angular.module('priorities').config(['$stateProvider',
	function($stateProvider) {
		// Priorities state routing
		$stateProvider.
		state('listPriorities', {
			url: '/priorities',
			templateUrl: 'modules/priorities/views/list-priorities.client.view.html'
		}).
		state('createPriority', {
			url: '/priorities/create',
			templateUrl: 'modules/priorities/views/create-priority.client.view.html'
		}).
		state('viewPriority', {
			url: '/priorities/:priorityId',
			templateUrl: 'modules/priorities/views/view-priority.client.view.html'
		}).
		state('editPriority', {
			url: '/priorities/:priorityId/edit',
			templateUrl: 'modules/priorities/views/edit-priority.client.view.html'
		});
	}
]);