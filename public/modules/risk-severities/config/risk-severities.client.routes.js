'use strict';

//Setting up route
angular.module('risk-severities').config(['$stateProvider',
	function($stateProvider) {
		// Risk severities state routing
		$stateProvider.
		state('listRiskSeverities', {
			url: '/risk-severities',
			templateUrl: 'modules/risk-severities/views/list-risk-severities.client.view.html'
		}).
		state('createRiskSeverity', {
			url: '/risk-severities/create',
			templateUrl: 'modules/risk-severities/views/create-risk-severity.client.view.html'
		}).
		state('viewRiskSeverity', {
			url: '/risk-severities/:riskSeverityId',
			templateUrl: 'modules/risk-severities/views/view-risk-severity.client.view.html'
		}).
		state('editRiskSeverity', {
			url: '/risk-severities/:riskSeverityId/edit',
			templateUrl: 'modules/risk-severities/views/edit-risk-severity.client.view.html'
		});
	}
]);