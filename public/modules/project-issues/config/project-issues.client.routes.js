'use strict';

//Setting up route
angular.module('project-issues').config(['$stateProvider',
	function($stateProvider) {
		// Project issues state routing
		$stateProvider.
		state('project-issues', {
			url: '/project-issues',
			templateUrl: 'modules/project-issues/views/project-issues.client.view.html'
		});
		//state('listProjectIssues', {
		//	url: '/project-issues/list',
		//	templateUrl: 'modules/project-issues/views/list-project-issues.client.view.html'
		//}).
		//state('createProjectIssue', {
		//	url: '/project-issues/create',
		//	templateUrl: 'modules/project-issues/views/create-project-issue.client.view.html'
		//}).
		//state('viewProjectIssue', {
		//	url: '/project-issues/:projectIssueId',
		//	templateUrl: 'modules/project-issues/views/view-project-issue.client.view.html'
		//}).
		//state('editProjectIssue', {
		//	url: '/project-issues/:projectIssueId/edit',
		//	templateUrl: 'modules/project-issues/views/edit-project-issue.client.view.html'
		//});
	}
]);
