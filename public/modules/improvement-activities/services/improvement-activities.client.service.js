'use strict';

//Improvement activities service used to communicate Improvement activities REST endpoints
angular.module('improvement-activities').factory('ImprovementActivities', ['$resource',
	function($resource) {
		return $resource('improvement-activities/:improvementActivityId', { improvementActivityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);