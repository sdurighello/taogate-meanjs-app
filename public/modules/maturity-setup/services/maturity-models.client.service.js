'use strict';

//Maturity models service used to communicate Maturity models REST endpoints
angular.module('maturity-setup').factory('MaturityModels', ['$resource',
	function($resource) {
		return $resource('maturity-models/:maturityModelId', { maturityModelId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            // ----- Levels -----
            createLevel: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createLevel'
            },
            sortLevels: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/sortLevels'
            },
            updateLevel: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateLevel/:levelId'
            },
            deleteLevel: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteLevel/:levelId'
            },

            // ----- Domains -----
            createDomain: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createDomain'
            },
            updateDomain: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateDomain/:domainId'
            },
            deleteDomain: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteDomain/:domainId'
            },

            // ----- Dimensions -----
            createDimension: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createDimension/:levelId/:domainId'
            },
            updateDimension: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateDimension/:levelId/:domainId/:dimensionId'
            },
            deleteDimension: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteDomain/:levelId/:domainId/:dimensionId'
            },

            // ----- Maturity Score -----
            updateMaturityScore: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createActivity/:levelId/:domainId/:dimensionId'
            },

            // ----- Activities -----
            createActivity: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createActivity/:levelId/:domainId/:dimensionId'
            },
            updateActivity: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateActivity/:levelId/:domainId/:dimensionId/:activityId'
            },
            deleteActivity: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteActivity/:levelId/:domainId/:dimensionId/:activityId'
            }

		});
	}
]);
