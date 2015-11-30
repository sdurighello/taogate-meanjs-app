
'use strict';

//Actual durations service used to communicate Actual durations REST endpoints
angular.module('gate-management-review').factory('ActualDurations', ['$resource',
	function($resource) {
		return $resource('actual-durations/:actualDurationId', { actualDurationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
