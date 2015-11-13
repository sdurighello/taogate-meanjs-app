'use strict';

//People category values service used to communicate People category values REST endpoints
angular.module('people-category-values').factory('PeopleCategoryValues', ['$resource',
	function($resource) {
		return $resource('people-category-values/:peopleCategoryValueId', { peopleCategoryValueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);