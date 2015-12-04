'use strict';

//Priority values service used to communicate Priority values REST endpoints
angular.module('priority-setup').factory('PriorityValues', ['$resource',
	function($resource) {
		return $resource('priority-values/:priorityValueId', { priorityValueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
