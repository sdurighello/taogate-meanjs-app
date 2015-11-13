'use strict';

//Dependency impacts service used to communicate Dependency impacts REST endpoints
angular.module('dependency-impacts').factory('DependencyImpacts', ['$resource',
	function($resource) {
		return $resource('dependency-impacts/:dependencyImpactId', { dependencyImpactId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);