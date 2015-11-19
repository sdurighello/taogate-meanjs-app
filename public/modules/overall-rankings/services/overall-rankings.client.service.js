'use strict';

//Overall rankings service used to communicate Overall rankings REST endpoints
angular.module('overall-rankings').factory('OverallRankings', ['$resource',
	function($resource) {
		return $resource('overall-rankings/:overallRankingId', { overallRankingId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);