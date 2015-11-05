'use strict';

//Risks service used to communicate Risks REST endpoints
angular.module('risks').factory('Risks', ['$resource',
	function($resource) {
		return $resource('risks/:riskId', { riskId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);