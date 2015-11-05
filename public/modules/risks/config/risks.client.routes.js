'use strict';

//Setting up route
angular.module('risks').config(['$stateProvider',
	function($stateProvider) {
		// Risks state routing
		$stateProvider.
		state('listRisks', {
			url: '/risks',
			templateUrl: 'modules/risks/views/list-risks.client.view.html'
		}).
		state('createRisk', {
			url: '/risks/create',
			templateUrl: 'modules/risks/views/create-risk.client.view.html'
		}).
		state('viewRisk', {
			url: '/risks/:riskId',
			templateUrl: 'modules/risks/views/view-risk.client.view.html'
		}).
		state('editRisk', {
			url: '/risks/:riskId/edit',
			templateUrl: 'modules/risks/views/edit-risk.client.view.html'
		});
	}
]);