'use strict';

//People categories service used to communicate People categories REST endpoints
angular.module('people-setup').factory('PeopleCategories', ['$resource',
	function($resource) {
		return $resource('people-categories/:peopleCategoryId', { peopleCategoryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
