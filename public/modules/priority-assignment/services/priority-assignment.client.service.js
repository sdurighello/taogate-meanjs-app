'use strict';

//Definition dashboards service used to communicate Definition dashboards REST endpoints
angular.module('priority-assignment').factory('PriorityAssignment', ['$resource',
	function($resource) {
		return $resource('priority-assignment', {
		}, {
			prioritizationOverviewPortfolio: {
				method: 'GET',
				isArray: true,
				url: 'priority-assignment/prioritizationOverviewPortfolio'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectChangeRequests: ... }]
			},
            prioritizationOverviewStrategy: {
                method: 'GET',
                isArray: true,
                url: 'priority-assignment/prioritizationOverviewStrategy'
                // req.query: { project: project._id }
                // Returns: [{gate: ... , projectChangeRequests: ... }]
            }
		});
	}
]);
