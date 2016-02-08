'use strict';

//Portfolio review templates service used to communicate Portfolio review templates REST endpoints
angular.module('portfolio-review-templates').factory('PortfolioReviewTemplates', ['$resource',
	function($resource) {
		return $resource('portfolio-review-templates/:portfolioReviewTemplateId', { portfolioReviewTemplateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
