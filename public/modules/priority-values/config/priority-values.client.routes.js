'use strict';

//Setting up route
angular.module('priority-values').config(['$stateProvider',
	function($stateProvider) {
		// Priority values state routing
		$stateProvider.
		state('listPriorityValues', {
			url: '/priority-values',
			templateUrl: 'modules/priority-values/views/list-priority-values.client.view.html'
		}).
		state('createPriorityValue', {
			url: '/priority-values/create',
			templateUrl: 'modules/priority-values/views/create-priority-value.client.view.html'
		}).
		state('viewPriorityValue', {
			url: '/priority-values/:priorityValueId',
			templateUrl: 'modules/priority-values/views/view-priority-value.client.view.html'
		}).
		state('editPriorityValue', {
			url: '/priority-values/:priorityValueId/edit',
			templateUrl: 'modules/priority-values/views/edit-priority-value.client.view.html'
		});
	}
]);