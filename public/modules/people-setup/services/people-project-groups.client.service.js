'use strict';

//People project groups service used to communicate People project groups REST endpoints
angular.module('people-setup').factory('PeopleProjectGroups', ['$resource',
	function($resource) {
		return $resource('people-project-groups/:peopleProjectGroupId', { peopleProjectGroupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
