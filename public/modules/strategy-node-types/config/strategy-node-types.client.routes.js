'use strict';

//Setting up route
angular.module('strategy-node-types').config(['$stateProvider',
	function($stateProvider) {
		// Strategy node types state routing
		$stateProvider.
		state('listStrategyNodeTypes', {
			url: '/strategy-node-types',
			templateUrl: 'modules/strategy-node-types/views/list-strategy-node-types.client.view.html'
		}).
		state('createStrategyNodeType', {
			url: '/strategy-node-types/create',
			templateUrl: 'modules/strategy-node-types/views/create-strategy-node-type.client.view.html'
		}).
		state('viewStrategyNodeType', {
			url: '/strategy-node-types/:strategyNodeTypeId',
			templateUrl: 'modules/strategy-node-types/views/view-strategy-node-type.client.view.html'
		}).
		state('editStrategyNodeType', {
			url: '/strategy-node-types/:strategyNodeTypeId/edit',
			templateUrl: 'modules/strategy-node-types/views/edit-strategy-node-type.client.view.html'
		});
	}
]);