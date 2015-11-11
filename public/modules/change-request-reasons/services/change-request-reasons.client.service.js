'use strict';

//Change request reasons service used to communicate Change request reasons REST endpoints
angular.module('change-request-reasons').factory('ChangeRequestReasons', ['$resource',
	function($resource) {
		return $resource('change-request-reasons/:changeRequestReasonId', { changeRequestReasonId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);