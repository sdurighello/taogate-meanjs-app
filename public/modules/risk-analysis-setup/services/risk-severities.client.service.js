'use strict';

//Risk severities service used to communicate Risk severities REST endpoints
angular.module('risk-analysis-setup').factory('RiskSeverities', ['$resource',
	function($resource) {
		return $resource('risk-severities/:riskSeverityId', { riskSeverityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
