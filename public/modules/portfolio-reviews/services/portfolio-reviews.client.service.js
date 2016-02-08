'use strict';

//Portfolio reviews service used to communicate Portfolio reviews REST endpoints
angular.module('portfolio-reviews').factory('PortfolioReviews', ['$resource',
	function($resource) {
		return $resource('portfolio-reviews/:portfolioReviewId', { portfolioReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);