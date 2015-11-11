'use strict';

//Portfolio milestone types service used to communicate Portfolio milestone types REST endpoints
angular.module('portfolio-milestone-types').factory('PortfolioMilestoneTypes', ['$resource',
	function($resource) {
		return $resource('portfolio-milestone-types/:portfolioMilestoneTypeId', { portfolioMilestoneTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);