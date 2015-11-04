'use strict';

//Portfolio types service used to communicate Portfolio types REST endpoints
angular.module('portfolio-types').factory('PortfolioTypes', ['$resource',
	function($resource) {
		return $resource('portfolio-types/:portfolioTypeId', { portfolioTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);