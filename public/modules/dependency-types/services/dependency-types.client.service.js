'use strict';

//Dependency types service used to communicate Dependency types REST endpoints
angular.module('dependency-types').factory('DependencyTypes', ['$resource',
	function($resource) {
		return $resource('dependency-types/:dependencyTypeId', { dependencyTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);