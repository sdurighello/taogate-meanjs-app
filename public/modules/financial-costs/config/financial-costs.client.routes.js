'use strict';

//Setting up route
angular.module('financial-costs').config(['$stateProvider',
	function($stateProvider) {
		// Financial costs state routing
		$stateProvider.
		state('listFinancialCosts', {
			url: '/financial-costs',
			templateUrl: 'modules/financial-costs/views/list-financial-costs.client.view.html'
		}).
		state('createFinancialCost', {
			url: '/financial-costs/create',
			templateUrl: 'modules/financial-costs/views/create-financial-cost.client.view.html'
		}).
		state('viewFinancialCost', {
			url: '/financial-costs/:financialCostId',
			templateUrl: 'modules/financial-costs/views/view-financial-cost.client.view.html'
		}).
		state('editFinancialCost', {
			url: '/financial-costs/:financialCostId/edit',
			templateUrl: 'modules/financial-costs/views/edit-financial-cost.client.view.html'
		});
	}
]);