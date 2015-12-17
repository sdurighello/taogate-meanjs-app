'use strict';

//Gate status assignments service used to communicate Gate status assignments REST endpoints
angular.module('gate-management-review').factory('GateStatusAssignments', ['$resource',
	function($resource) {
		return $resource('gate-status-assignments/:gateStatusAssignmentId', { gateStatusAssignmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
