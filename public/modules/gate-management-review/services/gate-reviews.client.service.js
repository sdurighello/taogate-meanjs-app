'use strict';

//Gate reviews service used to communicate Gate reviews REST endpoints
angular.module('gate-management-review').factory('GateReviews', ['$resource',
	function($resource) {
		return $resource('gate-reviews/:gateReviewId', { gateReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            // --- Header & Status --

			updateHeader: {
				method: 'PUT',
				url: 'gate-reviews/:gateReviewId/header'
				// req.body: {whole gate review object}
			},
            updateStatus: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/gate-status-assignments/:gateStatusAssignmentId'
                // req.body: {whole gate review object}
            },

            // --- Outcomes --

            updateOutcome: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/outcomes/:actualCompletionId'
                // req.body: {whole gate review object}
            },

            // --- Actuals --

            updateActualCompletion: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/actual-completions/:actualCompletionId'
                // req.body: {whole gate review object}
            },
            updateActualCost: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/actual-costs/:actualCostId'
                // req.body: {whole gate review object}
            },
            updateActualDuration: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/actual-durations/:actualDurationId'
                // req.body: {whole gate review object}
            },

            // --- Estimates --

            updateEstimateCompletion: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/estimate-completions/:estimateCompletionId'
                // req.body: {whole gate review object}
            },
            updateEstimateCost: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/estimate-costs/:estimateCostId'
                // req.body: {whole gate review object}
            },
            updateEstimateDuration: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/estimate-durations/:estimateDurationId'
                // req.body: {whole gate review object}
            },

            // --- Baseline --

            updateBaselineCompletion: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/baseline-completions/:baselineCompletionId'
                // req.body: {whole gate review object}
            },
            updateBaselineCost: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/baseline-costs/:baselineCostId'
                // req.body: {whole gate review object}
            },
            updateBaselineDuration: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/baseline-duration-reviews/:baselineDurationReviewId/baseline-durations/:baselineDurationId'
                // req.body: {baselineDurationReview object}
            }
		});
	}
]);
