'use strict';

//Setting up route
angular.module('portfolio-types').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio types state routing
		$stateProvider.
		state('listPortfolioTypes', {
			url: '/portfolio-types',
			templateUrl: 'modules/portfolio-types/views/list-portfolio-types.client.view.html'
		}).
		state('createPortfolioType', {
			url: '/portfolio-types/create',
			templateUrl: 'modules/portfolio-types/views/create-portfolio-type.client.view.html'
		}).
		state('viewPortfolioType', {
			url: '/portfolio-types/:portfolioTypeId',
			templateUrl: 'modules/portfolio-types/views/view-portfolio-type.client.view.html'
		}).
		state('editPortfolioType', {
			url: '/portfolio-types/:portfolioTypeId/edit',
			templateUrl: 'modules/portfolio-types/views/edit-portfolio-type.client.view.html'
		});
	}
]);