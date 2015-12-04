'use strict';

//Change request states service used to communicate Change request states REST endpoints
angular.module('log-delivery-setup').factory('ChangeRequestStates', ['$resource',
	function($resource) {
		return $resource('change-request-states/:changeRequestStateId', { changeRequestStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
