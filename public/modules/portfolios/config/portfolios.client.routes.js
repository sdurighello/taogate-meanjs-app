'use strict';

//Setting up route
angular.module('portfolios').config(['$stateProvider',
	function($stateProvider) {
		// Portfolios state routing
		$stateProvider.
		state('listPortfolios', {
			url: '/portfolios',
			templateUrl: 'modules/portfolios/views/list-portfolios.client.view.html'
		}).
		state('createPortfolio', {
			url: '/portfolios/create',
			templateUrl: 'modules/portfolios/views/create-portfolio.client.view.html'
		}).
		state('viewPortfolio', {
			url: '/portfolios/:portfolioId',
			templateUrl: 'modules/portfolios/views/view-portfolio.client.view.html'
		}).
		state('editPortfolio', {
			url: '/portfolios/:portfolioId/edit',
			templateUrl: 'modules/portfolios/views/edit-portfolio.client.view.html'
		});
	}
]);
