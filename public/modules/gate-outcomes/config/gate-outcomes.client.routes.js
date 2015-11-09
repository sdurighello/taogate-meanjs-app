'use strict';

//Setting up route
angular.module('gate-outcomes').config(['$stateProvider',
	function($stateProvider) {
		// Gate outcomes state routing
		$stateProvider.
		state('listGateOutcomes', {
			url: '/gate-outcomes',
			templateUrl: 'modules/gate-outcomes/views/list-gate-outcomes.client.view.html'
		}).
		state('createGateOutcome', {
			url: '/gate-outcomes/create',
			templateUrl: 'modules/gate-outcomes/views/create-gate-outcome.client.view.html'
		}).
		state('viewGateOutcome', {
			url: '/gate-outcomes/:gateOutcomeId',
			templateUrl: 'modules/gate-outcomes/views/view-gate-outcome.client.view.html'
		}).
		state('editGateOutcome', {
			url: '/gate-outcomes/:gateOutcomeId/edit',
			templateUrl: 'modules/gate-outcomes/views/edit-gate-outcome.client.view.html'
		});
	}
]);