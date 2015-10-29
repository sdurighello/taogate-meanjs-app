'use strict';

//Category values service used to communicate Category values REST endpoints
angular.module('category-values').factory('CategoryValues', ['$resource',
	function($resource) {
		return $resource('category-values/:categoryValueId', { categoryValueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);