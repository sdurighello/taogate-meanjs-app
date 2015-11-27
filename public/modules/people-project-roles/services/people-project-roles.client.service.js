'use strict';

//People project roles service used to communicate People project roles REST endpoints
angular.module('people-project-roles').factory('PeopleProjectRoles', ['$resource',
	function($resource) {
		return $resource('people-project-roles/:peopleProjectRoleId', { peopleProjectRoleId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);