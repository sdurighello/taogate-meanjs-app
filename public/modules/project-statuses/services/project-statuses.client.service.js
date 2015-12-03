'use strict';

//Project statuses service used to communicate Project statuses REST endpoints
angular.module('project-statuses').factory('ProjectStatuses', ['$resource',
	function($resource) {
		return $resource('project-statuses/:projectStatusId', { projectStatusId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);