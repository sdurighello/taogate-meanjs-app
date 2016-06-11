'use strict';

//Project status reports service used to communicate Project status reports REST endpoints
angular.module('project-status-reports').factory('ProjectStatusReports', ['$resource',
	function($resource) {
		return $resource('project-status-reports/:projectStatusReportId', { projectStatusReportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);