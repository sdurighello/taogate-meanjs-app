'use strict';

//Dependencies service used to communicate Dependencies REST endpoints
angular.module('dependency-analysis').factory('Dependencies', ['$resource',
	function($resource) {
		return $resource('dependencies/:dependencyId', { dependencyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
