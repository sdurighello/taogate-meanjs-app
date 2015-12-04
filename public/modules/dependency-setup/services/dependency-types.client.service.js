'use strict';

//Dependency types service used to communicate Dependency types REST endpoints
angular.module('dependency-setup').factory('DependencyTypes', ['$resource',
	function($resource) {
		return $resource('dependency-types/:dependencyTypeId', { dependencyTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
