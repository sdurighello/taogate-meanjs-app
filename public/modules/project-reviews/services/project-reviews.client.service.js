'use strict';

//Project reviews service used to communicate Project reviews REST endpoints
angular.module('project-reviews').factory('ProjectReviews', ['$resource',
	function($resource) {
		return $resource('project-reviews/:projectReviewId', { projectReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'project-reviews/:projectReviewId/header'
				// req.body: {whole gate review object}
			},

            // --- People reviews --

            updatePeopleReview: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/update'
                // req.body: {outcomeReview object}
            },

            submitPeopleReview: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/groups/:groupId/items/:itemId/peopleReviews/:peopleReviewId/submit'
                // req.body: {outcomeReview object}
            },

            // --- Approval --

            submit: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/submit'
                // req.body: {whole gate review object}
            },

            complete: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/complete'
                // req.body: {whole gate review object}
            },

            draft: {
                method: 'PUT',
                url: 'project-reviews/:projectReviewId/draft'
                // req.body: {whole gate review object}
            }

        });
	}
]);
