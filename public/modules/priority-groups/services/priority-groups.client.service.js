'use strict';

//Priority groups service used to communicate Priority groups REST endpoints
angular.module('priority-groups').factory('PriorityGroups', ['$resource',
	function($resource) {
		return $resource('priority-groups/:priorityGroupId', { priorityGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);