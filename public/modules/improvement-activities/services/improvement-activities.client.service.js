'use strict';

//Improvement activities service used to communicate Improvement activities REST endpoints
angular.module('improvement-activities').factory('ImprovementActivities', ['$resource',
	function($resource) {
		return $resource('improvement-activities/:improvementActivityId', { improvementActivityId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			updateHeader: {
				method: 'PUT',
				url: 'improvement-activities/:improvementActivityId/header'
				// req.body: {whole issue object}
			},

			updateStatus: {
				method: 'PUT',
				url: 'improvement-activities/:improvementActivityId/status'
				// req.body: {whole issue object}
			}
		});
	}
]);
