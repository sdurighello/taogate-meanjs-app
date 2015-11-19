'use strict';

//Setting up route
angular.module('portfolio-rankings').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio rankings state routing
		$stateProvider.
		state('listPortfolioRankings', {
			url: '/portfolio-rankings',
			templateUrl: 'modules/portfolio-rankings/views/list-portfolio-rankings.client.view.html'
		}).
		state('createPortfolioRanking', {
			url: '/portfolio-rankings/create',
			templateUrl: 'modules/portfolio-rankings/views/create-portfolio-ranking.client.view.html'
		}).
		state('viewPortfolioRanking', {
			url: '/portfolio-rankings/:portfolioRankingId',
			templateUrl: 'modules/portfolio-rankings/views/view-portfolio-ranking.client.view.html'
		}).
		state('editPortfolioRanking', {
			url: '/portfolio-rankings/:portfolioRankingId/edit',
			templateUrl: 'modules/portfolio-rankings/views/edit-portfolio-ranking.client.view.html'
		});
	}
]);