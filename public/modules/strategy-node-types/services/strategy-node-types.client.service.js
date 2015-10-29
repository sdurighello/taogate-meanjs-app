'use strict';

//Strategy node types service used to communicate Strategy node types REST endpoints
angular.module('strategy-node-types').factory('StrategyNodeTypes', ['$resource',
	function($resource) {
		return $resource('strategy-node-types/:strategyNodeTypeId', { strategyNodeTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);