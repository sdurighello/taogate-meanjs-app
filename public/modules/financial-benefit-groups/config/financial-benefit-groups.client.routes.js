'use strict';

//Setting up route
angular.module('financial-benefit-groups').config(['$stateProvider',
	function($stateProvider) {
		// Financial benefit groups state routing
		$stateProvider.
		state('listFinancialBenefitGroups', {
			url: '/financial-benefit-groups',
			templateUrl: 'modules/financial-benefit-groups/views/list-financial-benefit-groups.client.view.html'
		}).
		state('createFinancialBenefitGroup', {
			url: '/financial-benefit-groups/create',
			templateUrl: 'modules/financial-benefit-groups/views/create-financial-benefit-group.client.view.html'
		}).
		state('viewFinancialBenefitGroup', {
			url: '/financial-benefit-groups/:financialBenefitGroupId',
			templateUrl: 'modules/financial-benefit-groups/views/view-financial-benefit-group.client.view.html'
		}).
		state('editFinancialBenefitGroup', {
			url: '/financial-benefit-groups/:financialBenefitGroupId/edit',
			templateUrl: 'modules/financial-benefit-groups/views/edit-financial-benefit-group.client.view.html'
		});
	}
]);