'use strict';

//Project review templates service used to communicate Project review templates REST endpoints
angular.module('project-review-templates').factory('ProjectReviewTemplates', ['$resource',
	function($resource) {
		return $resource('project-review-templates/:projectReviewTemplateId', { projectReviewTemplateId: '@_id'
		}, {
            update: {
                method: 'PUT'
            },

			// --- Review Group --

			createGroup: {
				method: 'PUT',
				url: 'project-review-templates/:projectReviewTemplateId/groups'
				// req.body: {new group obj}
			},

            updateGroup: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/update'
                // req.body: {new group obj}
            },

            deleteGroup: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/delete'
                // req.body: {new group obj}
            },

            // --- Add/Remove Stakeholder Groups ---

            addStakeholderGroup: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/add'
                // req.body: {new group obj}
            },

            removeStakeholderGroup: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/remove'
                // req.body: {new group obj}
            },

            // --- Review Item --

            createItem: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/items'
                // req.body: {new group obj}
            },

            updateItem: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/items/:itemId/update'
                // req.body: {new group obj}
            },

            deleteItem: {
                method: 'PUT',
                url: 'project-review-templates/:projectReviewTemplateId/groups/:groupId/items/:itemId/delete'
                // req.body: {new group obj}
            }




		});
	}
]);
