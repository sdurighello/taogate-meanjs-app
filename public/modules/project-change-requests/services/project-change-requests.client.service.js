'use strict';

//Project change requests service used to communicate Project change requests REST endpoints
angular.module('project-change-requests').factory('ProjectChangeRequests', ['$resource',
	function($resource) {
		return $resource('project-change-requests/:projectChangeRequestId', { projectChangeRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);