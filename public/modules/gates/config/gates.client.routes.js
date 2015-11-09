'use strict';

//Setting up route
angular.module('gates').config(['$stateProvider',
	function($stateProvider) {
		// Gates state routing
		$stateProvider.
		state('listGates', {
			url: '/gates',
			templateUrl: 'modules/gates/views/list-gates.client.view.html'
		}).
		state('createGate', {
			url: '/gates/create',
			templateUrl: 'modules/gates/views/create-gate.client.view.html'
		}).
		state('viewGate', {
			url: '/gates/:gateId',
			templateUrl: 'modules/gates/views/view-gate.client.view.html'
		}).
		state('editGate', {
			url: '/gates/:gateId/edit',
			templateUrl: 'modules/gates/views/edit-gate.client.view.html'
		});
	}
]);