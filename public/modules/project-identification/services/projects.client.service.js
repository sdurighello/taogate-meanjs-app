'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('project-identification').factory('Projects', ['$resource',
	function($resource) {
		return $resource('projects/:projectId', { projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            updateStrategyAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/strategyAssignment'
                // req.body: {valueId: category value id}
            },
			updatePortfolioAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/portfolioAssignment'
				// req.body: {valueId: category value id}
			},
			updateCategoryAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/categoryAssignment/:assignedGroupId/:assignedCategoryId'
				// req.body: {valueId: category value id}
			},
			updatePriorityAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/priorityAssignment/:assignedGroupId/:assignedPriorityId'
				// req.body: {valueId: priority value id}
			},
			updateImpactAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/impactAssignment/:assignedGroupId/:assignedImpactId'
				// req.body: {scoreId: impact score id}
			},
			updateRiskAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/riskAssignment/:assignedCategoryId/:assignedRiskId'
				// req.body: {probabilityId: risk probability id, impactId: risk impact id}
			},
			updatePeopleAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/stakeholders/:assignedGroupId/:assignedRoleId'
				// req.body: {the whole "assignedRole" object}
			},

            // ------- DELIVERY PROCESS -------

            confirmAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/confirmAssignment'
                // req.body: {processId: gate process id}
            },
            customAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/customAssignment'
                // req.body: {processId: gate process id}
            },
            standardAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/standardAssignment'
                // req.body: {processId: gate process id}
            },
            removeAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/removeAssignment'
                // req.body: {processId: gate process id}
            },

            // --- Process header ---
            
            updateProcess: {
                method: 'PUT',
                url: 'projects/:projectId/updateProcess'
            },
            
            // --- Gate ---

            createGate: {
                method: 'PUT',
                url: 'projects/:projectId/createGate'
            },
            updateGateHeader: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/updateHeader'
            },
            updateGatePosition: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/updatePosition'
            },
            deleteGate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/delete'
            },

            // --- Outcome ---

            createOutcome: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createOutcome'
            },
            updateOutcome: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-outcomes/:projectOutcomeId/update'
            },
            deleteOutcome: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-outcomes/:projectOutcomeId/delete'
            },

            // --- Approval --

            submitProcess: {
                method: 'PUT',
                url: 'projects/:projectId/submitProcess'
            },
            approveProcess: {
                method: 'PUT',
                url: 'projects/:projectId/approveProcess'
            },
            rejectProcess: {
                method: 'PUT',
                url: 'projects/:projectId/rejectProcess'
            },
            draftProcess: {
                method: 'PUT',
                url: 'projects/:projectId/draftProcess'
            },

            // ----------------- GATE REVIEWS ---------------------

            createGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createGateReview'
                // req.body: {gate review object}
            },

            deleteGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/delete'
                // req.body: {gate review object}
            },

            // --- Header & Status & Budget--

            updateGateReviewHeader: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/header'
                // req.body: {whole gate review object}
            },
            updateGateStateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/state'
                // req.body: {whole gate review object}
            },
            updateGateBudgetReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/budget'
                // req.body: {whole gate review object}
            },

            // --- Outcomes --

            updateOutcomeScoreReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/outcome-score-reviews/:outcomeScoreReviewId'
            },

            // --- Actuals --

            updateActualCompletionReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/actual-completion-reviews/:actualCompletionReviewId'
                // req.body: {actual-completion-review object}
            },
            updateActualCostReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/actual-cost-reviews/:actualCostReviewId'
                // req.body: {actual-cost-review object}
            },
            updateActualDurationReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/actual-duration-reviews/:actualDurationReviewId'
                // req.body: {actual-duration-review object}
            },

            // --- Estimates --

            updateEstimateCompletionReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/estimate-completion-reviews/:estimateCompletionReviewId'
                // req.body: {estimate-completion-review object}
            },
            updateEstimateCostReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/estimate-cost-reviews/:estimateCostReviewId'
                // req.body: {estimate-cost-review object}
            },
            updateEstimateDurationReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/estimate-duration-reviews/:estimateDurationReviewId'
                // req.body: {estimate-duration-review object}
            },

            // --- Baseline --

            updateBaselineCompletionReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/baseline-completion-reviews/:baselineCompletionReviewId'
                // req.body: {baseline-completion-review object}
            },
            updateBaselineCostReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/baseline-cost-reviews/:baselineCostReviewId'
                // req.body: {baseline-cost-review object}
            },
            updateBaselineDurationReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/baseline-duration-reviews/:baselineDurationReviewId'
                // req.body: {baselineDurationReview object}
            },

            // --- Approval --

            submitGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/submit'
                // req.body: {whole gate review object}
            },

            approveGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/approve'
                // req.body: {whole gate review object}
            },

            rejectGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/reject'
                // req.body: {whole gate review object}
            },

            draftGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/draft'
                // req.body: {whole gate review object}
            },

            // ----------------- PROJECT CHANGE REQUESTS ---------------------

            createChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createChangeRequest'
                // req.body: {gate review object}
            },

            deleteChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/delete'
                // req.body: {gate review object}
            },

            // --- Header & Status --

            updateChangeRequestHeader: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/header'
                // req.body: {whole gate review object}
            },
            updateChangeRequestStatus: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/status'
                // req.body: {whole gate review object}
            },
            
            // --- Budget ---

            updateGateBudgetReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/budget'
                // req.body: {whole gate review object}
            },

            // --- Actuals --

            updateActualCompletionReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/actual-completion-reviews/:actualCompletionReviewId'
                // req.body: {actual-completion-review object}
            },
            updateActualCostReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/actual-cost-reviews/:actualCostReviewId'
                // req.body: {actual-cost-review object}
            },
            updateActualDurationReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/actual-duration-reviews/:actualDurationReviewId'
                // req.body: {actual-duration-review object}
            },
            
            // --- Baseline --

            updateBaselineCompletionReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/baseline-completion-reviews/:baselineCompletionReviewId'
                // req.body: {baseline-completion-review object}
            },
            updateBaselineCostReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/baseline-cost-reviews/:baselineCostReviewId'
                // req.body: {baseline-cost-review object}
            },
            updateBaselineDurationReviewForCR: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/baseline-duration-reviews/:baselineDurationReviewId'
                // req.body: {baselineDurationReview object}
            },

            // --- Approval --

            submitChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/submit'
            },

            approveChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/approve'
            },

            rejectChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/reject'
            },

            draftChangeRequest: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/draft'
            },

            // ----------------- PROJECT STATUS UPDATES ---------------------

            createStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createStatusUpdate'
            },

            deleteStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/delete'
            },

            // --- Header ---

            updateStatusUpdateHeader: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/header'
            },
            
            // --- Overall Delivery Status ---
            
            updateOverallDeliveryStatus: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/overallDeliveryStatus'
            },

            updateDurationDeliveryStatus: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/durationDeliveryStatus'
            },

            updateCostDeliveryStatus: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/costDeliveryStatus'
            },

            updateCompletionDeliveryStatus: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/completionDeliveryStatus'
            },
            
            // --- Log status area

            updateStatusAreaReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/status-area-reviews/:statusAreaReviewId'
            },

            // --- Outcomes --

            updateOutcomeStatusReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/outcome-status-reviews/:outcomeStatusReviewId'
            },

            // --- Estimates --

            updateEstimateCompletionReviewForSU: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/estimate-completion-reviews/:estimateCompletionReviewId'
            },
            updateEstimateCostReviewForSU: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/estimate-cost-reviews/:estimateCostReviewId'
            },
            updateEstimateDurationReviewForSU: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/estimate-duration-reviews/:estimateDurationReviewId'
            },

            // --- Approval --

            submitStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/submit'
            },

            approveStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/approve'
            },

            rejectStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/reject'
            },

            draftStatusUpdate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/draft'
            }
            
            
		});
	}
]);

/*

 GET (using "getById"): add "query" properties to set return-properties and deep populate in addition to the "projectId"

 if(req.query.retPropertiesString){
 retPropertiesString = req.query.retPropertiesString;
 }

 if(req.query.deepPopulateArray){
 deepPopulateArray = req.query.deepPopulateArray;
 }

 QUERY (using "list"): the server will automatically filter the return objects based on any property added to the "query"

 if(!_.isEmpty(req.query)){
 for (var property in req.query) {
 if (req.query.hasOwnProperty(property)) {
 queryObj[property] = req.query[property];
 }
 }
 }

 */
