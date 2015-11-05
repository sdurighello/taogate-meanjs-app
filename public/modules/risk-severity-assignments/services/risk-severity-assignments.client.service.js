'use strict';

//Risk severity assignments service used to communicate Risk severity assignments REST endpoints
angular.module('risk-severity-assignments').factory('RiskSeverityAssignments', ['$resource',
	function($resource) {
		return $resource('risk-severity-assignments/:riskSeverityAssignmentId', { riskSeverityAssignmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);