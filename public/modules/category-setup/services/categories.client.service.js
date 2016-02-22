'use strict';

//Categories service used to communicate Categories REST endpoints
angular.module('category-setup').factory('Categories', ['$resource',
	function($resource) {
		return $resource('categories/:categoryId', { categoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
