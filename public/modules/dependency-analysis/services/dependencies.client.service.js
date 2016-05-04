'use strict';

//Dependencies service used to communicate Dependencies REST endpoints
angular.module('dependency-analysis').factory('Dependencies', ['$resource',
	function($resource) {
		return $resource('dependencies/:dependencyId', { dependencyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'dependencies/:dependencyId/header'
				// req.body: {whole milestone object}
			},

			// --- Status --

			updateStatus: {
				method: 'PUT',
				url: 'dependencies/:dependencyId/status'
				// req.body: {whole milestone object}
			},
            
            // --- Analysis --

            getDependenciesAnalysis: {
                method: 'GET',
                isArray: false,
                url: 'dependencies-analysis'
            }
            
		});
	}
]);
