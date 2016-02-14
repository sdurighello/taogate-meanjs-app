'use strict';

//Definition dashboards service used to communicate Definition dashboards REST endpoints
angular.module('category-assignment').factory('CategoryAssignment', ['$resource',
	function($resource) {
		return $resource('category-assignment', {
		}, {
			categorizationOverview: {
				method: 'GET',
				isArray: true,
				url: 'category-assignment/categorizationOverview'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectChangeRequests: ... }]
			}
		});
	}
]);
