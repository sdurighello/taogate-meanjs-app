'use strict';

//Dependency states service used to communicate Dependency states REST endpoints
angular.module('dependency-setup').factory('DependencyStates', ['$resource',
	function($resource) {
		return $resource('dependency-states/:dependencyStateId', { dependencyStateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
