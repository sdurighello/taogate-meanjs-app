'use strict';

//Portfolio reviews service used to communicate Portfolio reviews REST endpoints
angular.module('portfolio-reviews').factory('PortfolioReviews', ['$resource',
	function($resource) {
		return $resource('portfolio-reviews/:portfolioReviewId', { portfolioReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/header'
				// req.body: {whole gate review object}
			},

			// --- People reviews --

			updatePeopleReview: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/update'
				// req.body: {outcomeReview object}
			},

			submitPeopleReview: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/submit'
				// req.body: {outcomeReview object}
			},

			// --- Approval --

			submit: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/submit'
				// req.body: {whole gate review object}
			},

			complete: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/complete'
				// req.body: {whole gate review object}
			},

			draft: {
				method: 'PUT',
				url: 'portfolio-reviews/:portfolioReviewId/draft'
				// req.body: {whole gate review object}
			}

		});
	}
]);
