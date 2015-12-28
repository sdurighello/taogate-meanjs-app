'use strict';

//Log statuses service used to communicate Log statuses REST endpoints
angular.module('status-report-setup').factory('LogStatusIndicators', ['$resource',
	function($resource) {
		return $resource('log-status-indicators/:logStatusIndicatorId', { logStatusIndicatorId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
