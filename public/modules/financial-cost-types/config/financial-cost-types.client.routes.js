'use strict';

//Setting up route
angular.module('financial-cost-types').config(['$stateProvider',
	function($stateProvider) {
		// Financial cost types state routing
		$stateProvider.
		state('listFinancialCostTypes', {
			url: '/financial-cost-types',
			templateUrl: 'modules/financial-cost-types/views/list-financial-cost-types.client.view.html'
		}).
		state('createFinancialCostType', {
			url: '/financial-cost-types/create',
			templateUrl: 'modules/financial-cost-types/views/create-financial-cost-type.client.view.html'
		}).
		state('viewFinancialCostType', {
			url: '/financial-cost-types/:financialCostTypeId',
			templateUrl: 'modules/financial-cost-types/views/view-financial-cost-type.client.view.html'
		}).
		state('editFinancialCostType', {
			url: '/financial-cost-types/:financialCostTypeId/edit',
			templateUrl: 'modules/financial-cost-types/views/edit-financial-cost-type.client.view.html'
		});
	}
]);