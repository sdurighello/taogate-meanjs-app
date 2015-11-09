'use strict';

//Setting up route
angular.module('gate-statuses').config(['$stateProvider',
	function($stateProvider) {
		// Gate statuses state routing
		$stateProvider.
		state('listGateStatuses', {
			url: '/gate-statuses',
			templateUrl: 'modules/gate-statuses/views/list-gate-statuses.client.view.html'
		}).
		state('createGateStatus', {
			url: '/gate-statuses/create',
			templateUrl: 'modules/gate-statuses/views/create-gate-status.client.view.html'
		}).
		state('viewGateStatus', {
			url: '/gate-statuses/:gateStatusId',
			templateUrl: 'modules/gate-statuses/views/view-gate-status.client.view.html'
		}).
		state('editGateStatus', {
			url: '/gate-statuses/:gateStatusId/edit',
			templateUrl: 'modules/gate-statuses/views/edit-gate-status.client.view.html'
		});
	}
]);