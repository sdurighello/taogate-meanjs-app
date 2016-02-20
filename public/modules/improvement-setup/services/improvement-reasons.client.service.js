'use strict';

//Improvement reasons service used to communicate Improvement reasons REST endpoints
angular.module('improvement-setup').factory('ImprovementReasons', ['$resource',
	function($resource) {
		return $resource('improvement-reasons/:improvementReasonId', { improvementReasonId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
