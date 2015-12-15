'use strict';

//Process assignments service used to communicate Process assignments REST endpoints
angular.module('gate-management-assignment').factory('ProcessAssignments', ['$resource',
	function($resource) {
		return $resource('process-assignments/:processAssignmentId', { processAssignmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			updateProcess: {
				method: 'PUT',
				url: 'process-assignments/:processAssignmentId/updateProcess'
				// req.body: {processId: gate process id}
			},
			findOneByProjectId: {
				method: 'GET',
				url: 'process-assignments/findOneByProjectId/:projectId'
			}
		});
	}
]);
