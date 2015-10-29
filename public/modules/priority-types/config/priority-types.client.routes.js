'use strict';

//Setting up route
angular.module('priority-types').config(['$stateProvider',
	function($stateProvider) {
		// Priority types state routing
		$stateProvider.
		state('listPriorityTypes', {
			url: '/priority-types',
			templateUrl: 'modules/priority-types/views/list-priority-types.client.view.html'
		}).
		state('createPriorityType', {
			url: '/priority-types/create',
			templateUrl: 'modules/priority-types/views/create-priority-type.client.view.html'
		}).
		state('viewPriorityType', {
			url: '/priority-types/:priorityTypeId',
			templateUrl: 'modules/priority-types/views/view-priority-type.client.view.html'
		}).
		state('editPriorityType', {
			url: '/priority-types/:priorityTypeId/edit',
			templateUrl: 'modules/priority-types/views/edit-priority-type.client.view.html'
		});
	}
]);