'use strict';

//Log priorities service used to communicate Log priorities REST endpoints
angular.module('log-priorities').factory('LogPriorities', ['$resource',
	function($resource) {
		return $resource('log-priorities/:logPriorityId', { logPriorityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);