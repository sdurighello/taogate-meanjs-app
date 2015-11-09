'use strict';

//Gate outcomes service used to communicate Gate outcomes REST endpoints
angular.module('gate-outcomes').factory('GateOutcomes', ['$resource',
	function($resource) {
		return $resource('gate-outcomes/:gateOutcomeId', { gateOutcomeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);