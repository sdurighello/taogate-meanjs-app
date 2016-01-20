'use strict';

//Definition dashboards service used to communicate Definition dashboards REST endpoints
angular.module('definition-dashboards').factory('DefinitionDashboards', ['$resource',
	function($resource) {
		return $resource('definition-dashboards', {
		}, {
			projectCategorization: {
				method: 'GET',
				isArray: true,
				url: 'definition-dashboards/projectCategorization'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectChangeRequests: ... }]
			}
		});
	}
]);
