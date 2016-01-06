'use strict';

//Project change requests service used to communicate Project change requests REST endpoints
angular.module('project-change-requests').factory('ProjectChangeRequests', ['$resource',
	function($resource) {
		return $resource('project-change-requests/:projectChangeRequestId', { projectChangeRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Changes By Project --
			getChangeRequestsForProject: {
				method: 'GET',
				isArray: true,
				url: 'project-change-requests-changeRequestsForProject'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectChangeRequests: ... }]
			},

			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'project-change-requests/:projectChangeRequestId/header'
				// req.body: {whole gate review object}
			},

            // --- Status --

			updateStatus: {
				method: 'PUT',
				url: 'project-change-requests/:projectChangeRequestId/status'
				// req.body: {whole gate review object}
			},

			// --- Apply Change --

			applyChange: {
				method: 'PUT',
				url: 'project-change-requests/:projectChangeRequestId/applyChange'
				// req.body: {whole gate review object}
			},

			// --- Actuals --

			updateActualCompletion: {
				method: 'PUT',
				url: 'project-change-requests/:projectChangeRequestId/actual-completion-reviews/:actualCompletionReviewId'
				// req.body: {actual-completion-review object}
			},
			updateActualCost: {
				method: 'PUT',
				url: 'project-change-requests/:projectChangeRequestId/actual-cost-reviews/:actualCostReviewId'
				// req.body: {actual-cost-review object}
			},
			updateActualDuration: {
				method: 'PUT',
				url: 'project-change-requests/:projectChangeRequestId/actual-duration-reviews/:actualDurationReviewId'
				// req.body: {actual-duration-review object}
			},

			// --- Baseline --

			updateBaselineCompletion: {
				method: 'PUT',
				url: 'project-change-requests/:projectChangeRequestId/baseline-completion-reviews/:baselineCompletionReviewId'
				// req.body: {baseline-completion-review object}
			},
			updateBaselineCost: {
				method: 'PUT',
				url: 'project-change-requests/:projectChangeRequestId/baseline-cost-reviews/:baselineCostReviewId'
				// req.body: {baseline-cost-review object}
			},
			updateBaselineDuration: {
				method: 'PUT',
				url: 'project-change-requests/:projectChangeRequestId/baseline-duration-reviews/:baselineDurationReviewId'
				// req.body: {baselineDurationReview object}
			}
		});
	}
]);
