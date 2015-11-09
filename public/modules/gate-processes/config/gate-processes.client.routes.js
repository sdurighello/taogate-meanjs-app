'use strict';

//Setting up route
angular.module('gate-processes').config(['$stateProvider',
	function($stateProvider) {
		// Gate processes state routing
		$stateProvider.
		state('listGateProcesses', {
			url: '/gate-processes',
			templateUrl: 'modules/gate-processes/views/list-gate-processes.client.view.html'
		}).
		state('createGateProcess', {
			url: '/gate-processes/create',
			templateUrl: 'modules/gate-processes/views/create-gate-process.client.view.html'
		}).
		state('viewGateProcess', {
			url: '/gate-processes/:gateProcessId',
			templateUrl: 'modules/gate-processes/views/view-gate-process.client.view.html'
		}).
		state('editGateProcess', {
			url: '/gate-processes/:gateProcessId/edit',
			templateUrl: 'modules/gate-processes/views/edit-gate-process.client.view.html'
		});
	}
]);