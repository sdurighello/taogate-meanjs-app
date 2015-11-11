'use strict';

//Setting up route
angular.module('issue-states').config(['$stateProvider',
	function($stateProvider) {
		// Issue states state routing
		$stateProvider.
		state('listIssueStates', {
			url: '/issue-states',
			templateUrl: 'modules/issue-states/views/list-issue-states.client.view.html'
		}).
		state('createIssueState', {
			url: '/issue-states/create',
			templateUrl: 'modules/issue-states/views/create-issue-state.client.view.html'
		}).
		state('viewIssueState', {
			url: '/issue-states/:issueStateId',
			templateUrl: 'modules/issue-states/views/view-issue-state.client.view.html'
		}).
		state('editIssueState', {
			url: '/issue-states/:issueStateId/edit',
			templateUrl: 'modules/issue-states/views/edit-issue-state.client.view.html'
		});
	}
]);