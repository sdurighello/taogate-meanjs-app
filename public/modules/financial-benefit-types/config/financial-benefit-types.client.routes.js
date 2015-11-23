'use strict';

//Setting up route
angular.module('financial-benefit-types').config(['$stateProvider',
	function($stateProvider) {
		// Financial benefit types state routing
		$stateProvider.
		state('listFinancialBenefitTypes', {
			url: '/financial-benefit-types',
			templateUrl: 'modules/financial-benefit-types/views/list-financial-benefit-types.client.view.html'
		}).
		state('createFinancialBenefitType', {
			url: '/financial-benefit-types/create',
			templateUrl: 'modules/financial-benefit-types/views/create-financial-benefit-type.client.view.html'
		}).
		state('viewFinancialBenefitType', {
			url: '/financial-benefit-types/:financialBenefitTypeId',
			templateUrl: 'modules/financial-benefit-types/views/view-financial-benefit-type.client.view.html'
		}).
		state('editFinancialBenefitType', {
			url: '/financial-benefit-types/:financialBenefitTypeId/edit',
			templateUrl: 'modules/financial-benefit-types/views/edit-financial-benefit-type.client.view.html'
		});
	}
]);