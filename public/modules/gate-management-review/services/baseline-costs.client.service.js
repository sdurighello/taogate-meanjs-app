
'use strict';

//Baseline costs service used to communicate Baseline costs REST endpoints
angular.module('gate-management-review').factory('BaselineCosts', ['$resource',
	function($resource) {
		return $resource('baseline-costs/:baselineCostId', { baselineCostId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
