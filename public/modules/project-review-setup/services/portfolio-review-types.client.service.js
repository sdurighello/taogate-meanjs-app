'use strict';

//Portfolio review types service used to communicate Portfolio review types REST endpoints
angular.module('project-review-setup').factory('PortfolioReviewTypes', ['$resource',
	function($resource) {
		return $resource('portfolio-review-types/:portfolioReviewTypeId', { portfolioReviewTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
