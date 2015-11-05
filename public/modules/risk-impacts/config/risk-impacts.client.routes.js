'use strict';

//Setting up route
angular.module('risk-impacts').config(['$stateProvider',
	function($stateProvider) {
		// Risk impacts state routing
		$stateProvider.
		state('listRiskImpacts', {
			url: '/risk-impacts',
			templateUrl: 'modules/risk-impacts/views/list-risk-impacts.client.view.html'
		}).
		state('createRiskImpact', {
			url: '/risk-impacts/create',
			templateUrl: 'modules/risk-impacts/views/create-risk-impact.client.view.html'
		}).
		state('viewRiskImpact', {
			url: '/risk-impacts/:riskImpactId',
			templateUrl: 'modules/risk-impacts/views/view-risk-impact.client.view.html'
		}).
		state('editRiskImpact', {
			url: '/risk-impacts/:riskImpactId/edit',
			templateUrl: 'modules/risk-impacts/views/edit-risk-impact.client.view.html'
		});
	}
]);