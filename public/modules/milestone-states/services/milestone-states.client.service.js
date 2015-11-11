'use strict';

//Milestone states service used to communicate Milestone states REST endpoints
angular.module('milestone-states').factory('MilestoneStates', ['$resource',
	function($resource) {
		return $resource('milestone-states/:milestoneStateId', { milestoneStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);