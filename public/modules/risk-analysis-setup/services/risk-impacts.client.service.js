'use strict';

//Risk impacts service used to communicate Risk impacts REST endpoints
angular.module('risk-analysis-setup').factory('RiskImpacts', ['$resource',
	function($resource) {
		return $resource('risk-impacts/:riskImpactId', { riskImpactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
