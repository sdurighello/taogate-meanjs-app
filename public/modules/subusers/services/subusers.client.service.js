'use strict';

//Subusers service used to communicate Subusers REST endpoints
angular.module('subusers').factory('Subusers', ['$resource',
	function($resource) {
		return $resource('subusers/:subuserId', { subuserId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);