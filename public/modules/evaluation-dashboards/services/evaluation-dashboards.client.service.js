'use strict';

//Evaluation dashboards service used to communicate Evaluation dashboards REST endpoints
angular.module('evaluation-dashboards').factory('EvaluationDashboards', ['$resource',
	function($resource) {
		return $resource('evaluation-dashboards/:evaluationDashboardId', { evaluationDashboardId: '@_id'
		}, {
			financialProfiles: {
				method: 'GET',
				isArray: true,
				url: 'evaluation-dashboards/financialProfiles'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectChangeRequests: ... }]
			}
		});
	}
]);
