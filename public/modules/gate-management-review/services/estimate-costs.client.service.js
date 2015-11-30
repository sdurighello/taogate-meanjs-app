
'use strict';

//Estimate costs service used to communicate Estimate costs REST endpoints
angular.module('gate-management-review').factory('EstimateCosts', ['$resource',
	function($resource) {
		return $resource('estimate-costs/:estimateCostId', { estimateCostId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
