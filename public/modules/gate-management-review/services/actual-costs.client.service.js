'use strict';

//Actual costs service used to communicate Actual costs REST endpoints
angular.module('gate-management-review').factory('ActualCosts', ['$resource',
	function($resource) {
		return $resource('actual-costs/:actualCostId', { actualCostId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
