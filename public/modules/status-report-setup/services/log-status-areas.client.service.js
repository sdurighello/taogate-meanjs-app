'use strict';

//Log status areas service used to communicate Log status areas REST endpoints
angular.module('status-report-setup').factory('LogStatusAreas', ['$resource',
	function($resource) {
		return $resource('log-status-areas/:logStatusAreaId', { logStatusAreaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
