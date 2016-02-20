'use strict';

//Improvement states service used to communicate Improvement states REST endpoints
angular.module('improvement-setup').factory('ImprovementStates', ['$resource',
	function($resource) {
		return $resource('improvement-states/:improvementStateId', { improvementStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
