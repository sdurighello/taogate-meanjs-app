'use strict';

//Dependencies service used to communicate Dependencies REST endpoints
angular.module('dependencies').factory('Dependencies', ['$resource',
	function($resource) {
		return $resource('dependencies/:dependencyId', { dependencyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);