'use strict';

//Review summaries service used to communicate Review summaries REST endpoints
angular.module('review-summaries').factory('ReviewSummaries', ['$resource',
	function($resource) {
		return $resource('review-summaries', {
		}, {
			projectReviews: {
				method: 'GET',
				isArray: true,
				url: 'review-summaries/projectReviews'
			},
			portfolioReviews: {
				method: 'GET',
				isArray: true,
				url: 'review-summaries/portfolioReviews'
			}
		});
	}
]);
