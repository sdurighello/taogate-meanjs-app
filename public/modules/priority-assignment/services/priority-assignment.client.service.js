'use strict';

//Definition dashboards service used to communicate Definition dashboards REST endpoints
angular.module('priority-assignment').factory('PriorityAssignment', ['$resource',
	function($resource) {
		return $resource('priority-assignment', {
		}, {
			prioritizationOverview: {
				method: 'GET',
				isArray: true,
				url: 'priority-assignment/prioritizationOverview'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectChangeRequests: ... }]
			}
		});
	}
]);
