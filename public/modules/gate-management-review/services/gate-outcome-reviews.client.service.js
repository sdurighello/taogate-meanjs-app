'use strict';

//Gate outcome reviews service used to communicate Gate outcome reviews REST endpoints
angular.module('gate-management-review').factory('GateOutcomeReviews', ['$resource',
	function($resource) {
		return $resource('gate-outcome-reviews/:gateOutcomeReviewId', { gateOutcomeReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
