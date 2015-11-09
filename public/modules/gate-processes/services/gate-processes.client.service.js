'use strict';

//Gate processes service used to communicate Gate processes REST endpoints
angular.module('gate-processes').factory('GateProcesses', ['$resource',
	function($resource) {
		return $resource('gate-processes/:gateProcessId', { gateProcessId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);