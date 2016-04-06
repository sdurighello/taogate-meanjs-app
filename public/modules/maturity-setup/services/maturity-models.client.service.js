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

            // ----- Areas -----
            createArea: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createArea'
            },
            updateArea: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateArea/:areaId'
            },
            deleteArea: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteArea/:areaId'
            },

            // ----- Dimensions -----
            createDimension: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createDimension'
            },
            updateDimension: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateDimension/:dimensionId'
            },
            deleteDimension: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteDimension/:dimensionId'
            },

            // ----- Maturity Review -----
            updateMaturityReview: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateMaturityReview/:dimensionId'
            },

            // ----- Activities -----
            createActivity: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/createActivity/:dimensionId'
            },
            updateActivity: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/updateActivity/:dimensionId/:activityId'
            },
            deleteActivity: {
                method: 'PUT',
                url: 'maturity-models/:maturityModelId/deleteActivity/:dimensionId/:activityId'
            }

		});
	}
]);
