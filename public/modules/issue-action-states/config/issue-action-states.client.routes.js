'use strict';

//Setting up route
angular.module('issue-action-states').config(['$stateProvider',
	function($stateProvider) {
		// Issue action states state routing
		$stateProvider.
		state('listIssueActionStates', {
			url: '/issue-action-states',
			templateUrl: 'modules/issue-action-states/views/list-issue-action-states.client.view.html'
		}).
		state('createIssueActionState', {
			url: '/issue-action-states/create',
			templateUrl: 'modules/issue-action-states/views/create-issue-action-state.client.view.html'
		}).
		state('viewIssueActionState', {
			url: '/issue-action-states/:issueActionStateId',
			templateUrl: 'modules/issue-action-states/views/view-issue-action-state.client.view.html'
		}).
		state('editIssueActionState', {
			url: '/issue-action-states/:issueActionStateId/edit',
			templateUrl: 'modules/issue-action-states/views/edit-issue-action-state.client.view.html'
		});
	}
]);