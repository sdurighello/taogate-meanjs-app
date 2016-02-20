'use strict';

//Improvement types service used to communicate Improvement types REST endpoints
angular.module('improvement-setup').factory('ImprovementTypes', ['$resource',
	function($resource) {
		return $resource('improvement-types/:improvementTypeId', { improvementTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
