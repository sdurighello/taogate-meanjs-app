'use strict';

//Actual completions service used to communicate Actual completions REST endpoints
angular.module('gate-management-review').factory('ActualCompletions', ['$resource',
	function($resource) {
		return $resource('actual-completions/:actualCompletionId', { actualCompletionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
