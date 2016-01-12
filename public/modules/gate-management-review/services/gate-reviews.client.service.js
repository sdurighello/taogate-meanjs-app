'use strict';

//Gate reviews service used to communicate Gate reviews REST endpoints
angular.module('gate-management-review').factory('GateReviews', ['$resource',
	function($resource) {
		return $resource('gate-reviews/:gateReviewId', { gateReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            // --- Reviews By Project --
            getReviewsForProject: {
                method: 'GET',
                isArray: true,
                url: 'gate-reviews-reviewsForProject'
                // req.query: { project: project._id }
                // Returns: [{gate: ... , gateReviews: ... }]
            },

            // --- Header & Status --

			updateHeader: {
				method: 'PUT',
				url: 'gate-reviews/:gateReviewId/header'
				// req.body: {whole gate review object}
			},
            updateStatus: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/status'
                // req.body: {whole gate review object}
            },
            updateBudget: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/budget'
                // req.body: {whole gate review object}
            },

            // --- Final --

            setFinal: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/final'
                // req.body: {whole gate review object}
            },

            // --- Outcomes --

            updateOutcomeReview: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/outcome-reviews/:outcomeReviewId'
                // req.body: {outcomeReview object}
            },

            // --- Actuals --

            updateActualCompletion: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/actual-completion-reviews/:actualCompletionReviewId'
                // req.body: {actual-completion-review object}
            },
            updateActualCost: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/actual-cost-reviews/:actualCostReviewId'
                // req.body: {actual-cost-review object}
            },
            updateActualDuration: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/actual-duration-reviews/:actualDurationReviewId'
                // req.body: {actual-duration-review object}
            },

            // --- Estimates --

            updateEstimateCompletion: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/estimate-completion-reviews/:estimateCompletionReviewId'
                // req.body: {estimate-completion-review object}
            },
            updateEstimateCost: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/estimate-cost-reviews/:estimateCostReviewId'
                // req.body: {estimate-cost-review object}
            },
            updateEstimateDuration: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/estimate-duration-reviews/:estimateDurationReviewId'
                // req.body: {estimate-duration-review object}
            },

            // --- Baseline --

            updateBaselineCompletion: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/baseline-completion-reviews/:baselineCompletionReviewId'
                // req.body: {baseline-completion-review object}
            },
            updateBaselineCost: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/baseline-cost-reviews/:baselineCostReviewId'
                // req.body: {baseline-cost-review object}
            },
            updateBaselineDuration: {
                method: 'PUT',
                url: 'gate-reviews/:gateReviewId/baseline-duration-reviews/:baselineDurationReviewId'
                // req.body: {baselineDurationReview object}
            }
		});
	}
]);
