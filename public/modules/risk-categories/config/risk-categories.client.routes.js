'use strict';

//Setting up route
angular.module('risk-categories').config(['$stateProvider',
	function($stateProvider) {
		// Risk categories state routing
		$stateProvider.
		state('listRiskCategories', {
			url: '/risk-categories',
			templateUrl: 'modules/risk-categories/views/list-risk-categories.client.view.html'
		}).
		state('createRiskCategory', {
			url: '/risk-categories/create',
			templateUrl: 'modules/risk-categories/views/create-risk-category.client.view.html'
		}).
		state('viewRiskCategory', {
			url: '/risk-categories/:riskCategoryId',
			templateUrl: 'modules/risk-categories/views/view-risk-category.client.view.html'
		}).
		state('editRiskCategory', {
			url: '/risk-categories/:riskCategoryId/edit',
			templateUrl: 'modules/risk-categories/views/edit-risk-category.client.view.html'
		});
	}
]);