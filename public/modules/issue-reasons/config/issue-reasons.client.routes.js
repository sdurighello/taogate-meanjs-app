'use strict';

//Setting up route
angular.module('issue-reasons').config(['$stateProvider',
	function($stateProvider) {
		// Issue reasons state routing
		$stateProvider.
		state('listIssueReasons', {
			url: '/issue-reasons',
			templateUrl: 'modules/issue-reasons/views/list-issue-reasons.client.view.html'
		}).
		state('createIssueReason', {
			url: '/issue-reasons/create',
			templateUrl: 'modules/issue-reasons/views/create-issue-reason.client.view.html'
		}).
		state('viewIssueReason', {
			url: '/issue-reasons/:issueReasonId',
			templateUrl: 'modules/issue-reasons/views/view-issue-reason.client.view.html'
		}).
		state('editIssueReason', {
			url: '/issue-reasons/:issueReasonId/edit',
			templateUrl: 'modules/issue-reasons/views/edit-issue-reason.client.view.html'
		});
	}
]);