'use strict';

//Status report types service used to communicate Status report types REST endpoints
angular.module('status-report-setup').factory('StatusReportTypes', ['$resource',
	function($resource) {
		return $resource('status-report-types/:statusReportTypeId', { statusReportTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
