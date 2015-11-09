'use strict';

//Gates service used to communicate Gates REST endpoints
angular.module('gates').factory('Gates', ['$resource',
	function($resource) {
		return $resource('gates/:gateId', { gateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);