'use strict';

//Gate statuses service used to communicate Gate statuses REST endpoints
angular.module('gate-statuses').factory('GateStatuses', ['$resource',
	function($resource) {
		return $resource('gate-statuses/:gateStatusId', { gateStatusId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);