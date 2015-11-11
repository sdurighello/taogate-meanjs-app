'use strict';

//Change requests service used to communicate Change requests REST endpoints
angular.module('change-requests').factory('ChangeRequests', ['$resource',
	function($resource) {
		return $resource('change-requests/:changeRequestId', { changeRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);