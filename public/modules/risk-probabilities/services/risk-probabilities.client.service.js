'use strict';

//Risk probabilities service used to communicate Risk probabilities REST endpoints
angular.module('risk-probabilities').factory('RiskProbabilities', ['$resource',
	function($resource) {
		return $resource('risk-probabilities/:riskProbabilityId', { riskProbabilityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);