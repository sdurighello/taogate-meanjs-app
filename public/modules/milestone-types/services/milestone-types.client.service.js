'use strict';

//Milestone types service used to communicate Milestone types REST endpoints
angular.module('milestone-types').factory('MilestoneTypes', ['$resource',
	function($resource) {
		return $resource('milestone-types/:milestoneTypeId', { milestoneTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);