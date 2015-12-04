'use strict';

//Log reasons service used to communicate Log reasons REST endpoints
angular.module('log-general-setup').factory('LogReasons', ['$resource',
	function($resource) {
		return $resource('log-reasons/:logReasonId', { logReasonId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
