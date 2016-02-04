'use strict';

//Evaluation dashboards service used to communicate Evaluation dashboards REST endpoints
angular.module('evaluation-dashboards').factory('EvaluationDashboards', ['$resource',
	function($resource) {
		return $resource('evaluation-dashboards', {
		}, {
			financialProfile: {
				method: 'GET',
				isArray: false,
				url: 'evaluation-dashboards/financialProfile/:projectId'
			}
		});
	}
]);
