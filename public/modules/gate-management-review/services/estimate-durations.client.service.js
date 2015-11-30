
'use strict';

//Estimate durations service used to communicate Estimate durations REST endpoints
angular.module('gate-management-review').factory('EstimateDurations', ['$resource',
	function($resource) {
		return $resource('estimate-durations/:estimateDurationId', { estimateDurationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
