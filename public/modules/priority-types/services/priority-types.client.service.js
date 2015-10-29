'use strict';

//Priority types service used to communicate Priority types REST endpoints
angular.module('priority-types').factory('PriorityTypes', ['$resource',
	function($resource) {
		return $resource('priority-types/:priorityTypeId', { priorityTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);