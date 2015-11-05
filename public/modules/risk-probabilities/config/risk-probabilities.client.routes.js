'use strict';

//Setting up route
angular.module('risk-probabilities').config(['$stateProvider',
	function($stateProvider) {
		// Risk probabilities state routing
		$stateProvider.
		state('listRiskProbabilities', {
			url: '/risk-probabilities',
			templateUrl: 'modules/risk-probabilities/views/list-risk-probabilities.client.view.html'
		}).
		state('createRiskProbability', {
			url: '/risk-probabilities/create',
			templateUrl: 'modules/risk-probabilities/views/create-risk-probability.client.view.html'
		}).
		state('viewRiskProbability', {
			url: '/risk-probabilities/:riskProbabilityId',
			templateUrl: 'modules/risk-probabilities/views/view-risk-probability.client.view.html'
		}).
		state('editRiskProbability', {
			url: '/risk-probabilities/:riskProbabilityId/edit',
			templateUrl: 'modules/risk-probabilities/views/edit-risk-probability.client.view.html'
		});
	}
]);