'use strict';

//People groups service used to communicate People groups REST endpoints
angular.module('people-groups').factory('PeopleGroups', ['$resource',
	function($resource) {
		return $resource('people-groups/:peopleGroupId', { peopleGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);