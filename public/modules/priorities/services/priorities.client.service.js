'use strict';

//Priorities service used to communicate Priorities REST endpoints
angular.module('priorities').factory('Priorities', ['$resource',
	function($resource) {
		return $resource('priorities/:priorityId', { priorityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);