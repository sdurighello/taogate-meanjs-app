'use strict';

//Setting up route
angular.module('log-priorities').config(['$stateProvider',
	function($stateProvider) {
		// Log priorities state routing
		$stateProvider.
		state('listLogPriorities', {
			url: '/log-priorities',
			templateUrl: 'modules/log-priorities/views/list-log-priorities.client.view.html'
		}).
		state('createLogPriority', {
			url: '/log-priorities/create',
			templateUrl: 'modules/log-priorities/views/create-log-priority.client.view.html'
		}).
		state('viewLogPriority', {
			url: '/log-priorities/:logPriorityId',
			templateUrl: 'modules/log-priorities/views/view-log-priority.client.view.html'
		}).
		state('editLogPriority', {
			url: '/log-priorities/:logPriorityId/edit',
			templateUrl: 'modules/log-priorities/views/edit-log-priority.client.view.html'
		});
	}
]);