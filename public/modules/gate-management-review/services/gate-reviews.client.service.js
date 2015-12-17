'use strict';

//Gate reviews service used to communicate Gate reviews REST endpoints
angular.module('gate-management-review').factory('GateReviews', ['$resource',
	function($resource) {
		return $resource('gate-reviews/:gateReviewId', { gateReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			updateHeader: {
				method: 'PUT',
				url: 'gate-reviews/:gateReviewId/header/:headerId'
				// req.body: {whole gate review object}
			}
		});
	}
]);
