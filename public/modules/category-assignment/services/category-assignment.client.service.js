'use strict';

//Definition dashboards service used to communicate Definition dashboards REST endpoints
angular.module('category-assignment').factory('CategoryAssignment', ['$resource',
	function($resource) {
		return $resource('category-assignment', {
		}, {
			categorizationOverviewPortfolio: {
				method: 'GET',
				isArray: true,
				url: 'category-assignment/categorizationOverviewPortfolio'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectChangeRequests: ... }]
			},
            categorizationOverviewStrategy: {
                method: 'GET',
                isArray: true,
                url: 'category-assignment/categorizationOverviewStrategy'
                // req.query: { project: project._id }
                // Returns: [{gate: ... , projectChangeRequests: ... }]
            }
		});
	}
]);
