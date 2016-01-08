'use strict';

//Portfolio change requests service used to communicate Portfolio change requests REST endpoints
angular.module('portfolio-change-requests').factory('PortfolioChangeRequests', ['$resource',
	function($resource) {
		return $resource('portfolio-change-requests/:portfolioChangeRequestId', { portfolioChangeRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);