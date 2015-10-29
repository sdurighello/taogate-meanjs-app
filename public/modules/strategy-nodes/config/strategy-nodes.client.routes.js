'use strict';

//Setting up route
angular.module('strategy-nodes').config(['$stateProvider',
	function($stateProvider) {
		// Strategy nodes state routing
		$stateProvider.
		state('listStrategyNodes', {
			url: '/strategy-nodes',
			templateUrl: 'modules/strategy-nodes/views/list-strategy-nodes.client.view.html'
		}).
		state('createStrategyNode', {
			url: '/strategy-nodes/create',
			templateUrl: 'modules/strategy-nodes/views/create-strategy-node.client.view.html'
		}).
		state('viewStrategyNode', {
			url: '/strategy-nodes/:strategyNodeId',
			templateUrl: 'modules/strategy-nodes/views/view-strategy-node.client.view.html'
		}).
		state('editStrategyNode', {
			url: '/strategy-nodes/:strategyNodeId/edit',
			templateUrl: 'modules/strategy-nodes/views/edit-strategy-node.client.view.html'
		});
	}
]);