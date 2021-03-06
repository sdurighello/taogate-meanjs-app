'use strict';

//Category groups service used to communicate Category groups REST endpoints
angular.module('category-setup').factory('CategoryGroups', ['$resource',
	function($resource) {
		return $resource('category-groups/:categoryGroupId', { categoryGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
