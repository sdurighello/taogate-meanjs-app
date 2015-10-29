'use strict';

//Strategy nodes service used to communicate Strategy nodes REST endpoints
angular.module('strategy-nodes').factory('StrategyNodes', ['$resource',
	function($resource) {
		return $resource('strategy-nodes/:strategyNodeId', { strategyNodeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);