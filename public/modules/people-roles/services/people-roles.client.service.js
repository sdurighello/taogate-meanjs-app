'use strict';

//People roles service used to communicate People roles REST endpoints
angular.module('people-roles').factory('PeopleRoles', ['$resource',
	function($resource) {
		return $resource('people-roles/:peopleRoleId', { peopleRoleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);