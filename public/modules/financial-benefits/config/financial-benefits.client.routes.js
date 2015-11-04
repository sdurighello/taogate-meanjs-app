'use strict';

//Setting up route
angular.module('financial-benefits').config(['$stateProvider',
	function($stateProvider) {
		// Financial benefits state routing
		$stateProvider.
		state('listFinancialBenefits', {
			url: '/financial-benefits',
			templateUrl: 'modules/financial-benefits/views/list-financial-benefits.client.view.html'
		}).
		state('createFinancialBenefit', {
			url: '/financial-benefits/create',
			templateUrl: 'modules/financial-benefits/views/create-financial-benefit.client.view.html'
		}).
		state('viewFinancialBenefit', {
			url: '/financial-benefits/:financialBenefitId',
			templateUrl: 'modules/financial-benefits/views/view-financial-benefit.client.view.html'
		}).
		state('editFinancialBenefit', {
			url: '/financial-benefits/:financialBenefitId/edit',
			templateUrl: 'modules/financial-benefits/views/edit-financial-benefit.client.view.html'
		});
	}
]);