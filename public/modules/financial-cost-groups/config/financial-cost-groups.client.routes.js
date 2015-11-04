'use strict';

//Setting up route
angular.module('financial-cost-groups').config(['$stateProvider',
	function($stateProvider) {
		// Financial cost groups state routing
		$stateProvider.
		state('listFinancialCostGroups', {
			url: '/financial-cost-groups',
			templateUrl: 'modules/financial-cost-groups/views/list-financial-cost-groups.client.view.html'
		}).
		state('createFinancialCostGroup', {
			url: '/financial-cost-groups/create',
			templateUrl: 'modules/financial-cost-groups/views/create-financial-cost-group.client.view.html'
		}).
		state('viewFinancialCostGroup', {
			url: '/financial-cost-groups/:financialCostGroupId',
			templateUrl: 'modules/financial-cost-groups/views/view-financial-cost-group.client.view.html'
		}).
		state('editFinancialCostGroup', {
			url: '/financial-cost-groups/:financialCostGroupId/edit',
			templateUrl: 'modules/financial-cost-groups/views/edit-financial-cost-group.client.view.html'
		});
	}
]);