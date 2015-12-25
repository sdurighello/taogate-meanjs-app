'use strict';

//Log statuses service used to communicate Log statuses REST endpoints
angular.module('log-delivery-setup').factory('LogStatuses', ['$resource',
	function($resource) {
		return $resource('log-statuses/:logStatusId', { logStatusId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
