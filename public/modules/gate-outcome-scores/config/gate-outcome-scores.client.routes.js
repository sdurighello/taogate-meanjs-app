'use strict';

//Setting up route
angular.module('gate-outcome-scores').config(['$stateProvider',
	function($stateProvider) {
		// Gate outcome scores state routing
		$stateProvider.
		state('listGateOutcomeScores', {
			url: '/gate-outcome-scores',
			templateUrl: 'modules/gate-outcome-scores/views/list-gate-outcome-scores.client.view.html'
		}).
		state('createGateOutcomeScore', {
			url: '/gate-outcome-scores/create',
			templateUrl: 'modules/gate-outcome-scores/views/create-gate-outcome-score.client.view.html'
		}).
		state('viewGateOutcomeScore', {
			url: '/gate-outcome-scores/:gateOutcomeScoreId',
			templateUrl: 'modules/gate-outcome-scores/views/view-gate-outcome-score.client.view.html'
		}).
		state('editGateOutcomeScore', {
			url: '/gate-outcome-scores/:gateOutcomeScoreId/edit',
			templateUrl: 'modules/gate-outcome-scores/views/edit-gate-outcome-score.client.view.html'
		});
	}
]);