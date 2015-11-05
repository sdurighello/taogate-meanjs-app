'use strict';

//Setting up route
angular.module('risk-severity-assignments').config(['$stateProvider',
	function($stateProvider) {
		// Risk severity assignments state routing
		$stateProvider.
		state('listRiskSeverityAssignments', {
			url: '/risk-severity-assignments',
			templateUrl: 'modules/risk-severity-assignments/views/list-risk-severity-assignments.client.view.html'
		}).
		state('createRiskSeverityAssignment', {
			url: '/risk-severity-assignments/create',
			templateUrl: 'modules/risk-severity-assignments/views/create-risk-severity-assignment.client.view.html'
		}).
		state('viewRiskSeverityAssignment', {
			url: '/risk-severity-assignments/:riskSeverityAssignmentId',
			templateUrl: 'modules/risk-severity-assignments/views/view-risk-severity-assignment.client.view.html'
		}).
		state('editRiskSeverityAssignment', {
			url: '/risk-severity-assignments/:riskSeverityAssignmentId/edit',
			templateUrl: 'modules/risk-severity-assignments/views/edit-risk-severity-assignment.client.view.html'
		});
	}
]);