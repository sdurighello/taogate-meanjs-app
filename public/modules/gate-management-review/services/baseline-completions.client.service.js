
'use strict';

//Baseline completions service used to communicate Baseline completions REST endpoints
angular.module('gate-management-review').factory('BaselineCompletions', ['$resource',
	function($resource) {
		return $resource('baseline-completions/:baselineCompletionId', { baselineCompletionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
