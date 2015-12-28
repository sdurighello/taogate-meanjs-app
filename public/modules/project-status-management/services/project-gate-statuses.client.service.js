'use strict';

//Project gate statuses service used to communicate Project gate statuses REST endpoints
angular.module('project-status-management').factory('ProjectGateStatuses', ['$resource',
	function($resource) {
		return $resource('project-gate-statuses/:projectGateStatusId', { projectGateStatusId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
