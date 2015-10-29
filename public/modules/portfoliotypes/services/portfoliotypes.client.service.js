'use strict';

//Portfoliotypes service used to communicate Portfoliotypes REST endpoints
angular.module('portfoliotypes').factory('Portfoliotypes', ['$resource',
	function($resource) {
		return $resource('portfoliotypes/:portfoliotypeId', { portfoliotypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);