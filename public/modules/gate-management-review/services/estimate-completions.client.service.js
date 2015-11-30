
'use strict';

//Estimate completions service used to communicate Estimate completions REST endpoints
angular.module('gate-management-review').factory('EstimateCompletions', ['$resource',
	function($resource) {
		return $resource('estimate-completions/:estimateCompletionId', { estimateCompletionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
