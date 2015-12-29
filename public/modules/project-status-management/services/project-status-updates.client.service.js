'use strict';

//Project status updates service used to communicate Project status updates REST endpoints
angular.module('project-status-management').factory('ProjectStatusUpdates', ['$resource',
	function($resource) {
		return $resource('project-status-updates/:projectStatusUpdateId', { projectStatusUpdateId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'project-status-updates/:projectStatusUpdateId/header'
				// req.body: {whole gate review object}
			},

            // --- Gate status ---
			updateStatus: {
				method: 'PUT',
				url: 'project-status-updates/:projectStatusUpdateId/gateStatus'
				// req.body: {whole gate review object}
			},

			// --- Apply update --

			applyUpdate: {
				method: 'PUT',
				url: 'project-status-updates/:projectStatusUpdateId/applyUpdate'
				// req.body: {whole gate review object}
			},

			// --- Outcomes --

			updateOutcomeStatus: {
				method: 'PUT',
				url: 'project-status-updates/:projectStatusUpdateId/outcome-status-updates/:outcomeStatusUpdateId'
				// req.body: {outcomeReview object}
			},

            // --- Areas --

            updateStatusArea: {
                method: 'PUT',
                url: 'project-status-updates/:projectStatusUpdateId/status-area-updates/:statusAreaUpdateId'
                // req.body: {statusAreaUpdate object}
            },

			// --- Estimates --

			updateEstimateCompletion: {
				method: 'PUT',
				url: 'project-status-updates/:projectStatusUpdateId/estimate-completion-reviews/:estimateCompletionReviewId'
				// req.body: {estimate-completion-review object}
			},
			updateEstimateCost: {
				method: 'PUT',
				url: 'project-status-updates/:projectStatusUpdateId/estimate-cost-reviews/:estimateCostReviewId'
				// req.body: {estimate-cost-review object}
			},
			updateEstimateDuration: {
				method: 'PUT',
				url: 'project-status-updates/:projectStatusUpdateId/estimate-duration-reviews/:estimateDurationReviewId'
				// req.body: {estimate-duration-review object}
			}

		});
	}
]);
