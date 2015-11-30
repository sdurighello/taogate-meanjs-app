
'use strict';

//Baseline durations service used to communicate Baseline durations REST endpoints
angular.module('gate-management-review').factory('BaselineDurations', ['$resource',
	function($resource) {
		return $resource('baseline-durations/:baselineDurationId', { baselineDurationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
