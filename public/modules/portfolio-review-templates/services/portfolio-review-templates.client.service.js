'use strict';

//Portfolio review templates service used to communicate Portfolio review templates REST endpoints
angular.module('portfolio-review-templates').factory('PortfolioReviewTemplates', ['$resource',
	function($resource) {
		return $resource('portfolio-review-templates/:portfolioReviewTemplateId', { portfolioReviewTemplateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Review Group --

			createGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups'
				// req.body: {new group obj}
			},

			updateGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/update'
				// req.body: {new group obj}
			},

			deleteGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/delete'
				// req.body: {new group obj}
			},

			// --- Add/Remove Stakeholder Groups ---

			addStakeholderGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/add'
				// req.body: {new group obj}
			},

			removeStakeholderGroup: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/remove'
				// req.body: {new group obj}
			},

			// --- Review Item --

			createItem: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/items'
				// req.body: {new group obj}
			},

			updateItem: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/items/:itemId/update'
				// req.body: {new group obj}
			},

			deleteItem: {
				method: 'PUT',
				url: 'portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/items/:itemId/delete'
				// req.body: {new group obj}
			}


		});
	}
]);
