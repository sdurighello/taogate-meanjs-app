'use strict';

//Gate outcome scores service used to communicate Gate outcome scores REST endpoints
angular.module('gate-review-setup').factory('GateOutcomeScores', ['$resource',
	function($resource) {
		return $resource('gate-outcome-scores/:gateOutcomeScoreId', { gateOutcomeScoreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
