'use strict';

//Setting up route
angular.module('portfolio-reviews').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio reviews state routing
		$stateProvider.
		state('listPortfolioReviews', {
			url: '/portfolio-reviews',
			templateUrl: 'modules/portfolio-reviews/views/list-portfolio-reviews.client.view.html'
		}).
		state('createPortfolioReview', {
			url: '/portfolio-reviews/create',
			templateUrl: 'modules/portfolio-reviews/views/create-portfolio-review.client.view.html'
		}).
		state('viewPortfolioReview', {
			url: '/portfolio-reviews/:portfolioReviewId',
			templateUrl: 'modules/portfolio-reviews/views/view-portfolio-review.client.view.html'
		}).
		state('editPortfolioReview', {
			url: '/portfolio-reviews/:portfolioReviewId/edit',
			templateUrl: 'modules/portfolio-reviews/views/edit-portfolio-review.client.view.html'
		});
	}
]);