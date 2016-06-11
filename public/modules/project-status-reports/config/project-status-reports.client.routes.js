'use strict';

//Setting up route
angular.module('project-status-reports').config(['$stateProvider',
	function($stateProvider) {
		// Project status reports state routing
		$stateProvider.
		state('listProjectStatusReports', {
			url: '/project-status-reports',
			templateUrl: 'modules/project-status-reports/views/list-project-status-reports.client.view.html'
		}).
		state('createProjectStatusReport', {
			url: '/project-status-reports/create',
			templateUrl: 'modules/project-status-reports/views/create-project-status-report.client.view.html'
		}).
		state('viewProjectStatusReport', {
			url: '/project-status-reports/:projectStatusReportId',
			templateUrl: 'modules/project-status-reports/views/view-project-status-report.client.view.html'
		}).
		state('editProjectStatusReport', {
			url: '/project-status-reports/:projectStatusReportId/edit',
			templateUrl: 'modules/project-status-reports/views/edit-project-status-report.client.view.html'
		});
	}
]);