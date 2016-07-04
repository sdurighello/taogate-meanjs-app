'use strict';

//Gate statuses service used to communicate Gate statuses REST endpoints
angular.module('gate-review-setup').factory('GateStates', ['$resource',
	function($resource) {
		return $resource('gate-states/:gateStateId', { gateStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
