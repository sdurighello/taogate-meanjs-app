'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projects = require('../../app/controllers/projects.server.controller');

	// Projects Routes
	app.route('/projects')
		.get(users.requiresLogin, projects.list)
		.post(users.requiresLogin, projects.hasCreateAuthorization, projects.create);

	app.route('/projects/:projectId')
		.get(users.requiresLogin, projects.read)
		.put(users.requiresLogin, projects.hasEditAuthorization, projects.update)
		.delete(users.requiresLogin, projects.hasEditAuthorization, projects.delete);

    // -------------------------- DEFINITION -----------------------------

	// Strategy assignment
	app.route('/projects/:projectId/strategyAssignment')
		.put(users.requiresLogin, projects.hasAssignmentAuthorization, projects.updateStrategyAssignment);

	// Portfolio assignment
	app.route('/projects/:projectId/portfolioAssignment')
		.put(users.requiresLogin, projects.hasAssignmentAuthorization, projects.updatePortfolioAssignment);

	// Category Assignment
	app.route('/projects/:projectId/categoryAssignment/:assignedGroupId/:assignedCategoryId')
		.put(users.requiresLogin, projects.hasEditAuthorization, projects.updateCategoryAssignment);

    // Priority Assignment
    app.route('/projects/:projectId/priorityAssignment/:assignedGroupId/:assignedPriorityId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.updatePriorityAssignment);

    // Impact Assignment
    app.route('/projects/:projectId/impactAssignment/:assignedGroupId/:assignedImpactId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.updateImpactAssignment);

    // Risk Assignment
    app.route('/projects/:projectId/riskAssignment/:assignedCategoryId/:assignedRiskId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.updateRiskAssignment);

    // Stakeholders
    app.route('/projects/:projectId/stakeholders/:assignedGroupId/:assignedRoleId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.updatePeopleAssignment);


    // -------------------------- PROCESS -----------------------------

    // Gate process assignment

    app.route('/projects/:projectId/confirmAssignment')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.confirmAssignment);

    app.route('/projects/:projectId/customAssignment')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.customAssignment);

    app.route('/projects/:projectId/standardAssignment')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.standardAssignment);

    app.route('/projects/:projectId/removeAssignment')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.removeAssignment);
    
    
    // Edit Project Process
    
    app.route('/projects/:projectId/updateProcess')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.updateProcess);

    app.route('/projects/:projectId/createGate')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.createGate);
    app.route('/projects/:projectId/project-gates/:projectGateId/updateHeader')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.updateGateHeader);
    app.route('/projects/:projectId/project-gates/:projectGateId/updatePosition')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.updateGatePosition);
    app.route('/projects/:projectId/project-gates/:projectGateId/delete')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.deleteGate);

    app.route('/projects/:projectId/project-gates/:projectGateId/createOutcome')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.createOutcome);
    app.route('/projects/:projectId/project-gates/:projectGateId/project-outcomes/:projectOutcomeId/update')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.updateOutcome);
    app.route('/projects/:projectId/project-gates/:projectGateId/project-outcomes/:projectOutcomeId/delete')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.deleteOutcome);
    
    // Approve Project Process

    app.route('/projects/:projectId/submitProcess')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.submitProcess);

    app.route('/projects/:projectId/approveProcess')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.approveProcess);

    app.route('/projects/:projectId/rejectProcess')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.rejectProcess);

    app.route('/projects/:projectId/draftProcess')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.draftProcess);


    // -------------------------- GATE REVIEWS -----------------------------


    // Gate Reviews

    app.route('/projects/:projectId/project-gates/:projectGateId/createGateReview')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.createGateReview);
    
    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/delete')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.deleteGateReview);

    // Gate Reviews Approval

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/submit')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.submitGateReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/approve')
        .put(users.requiresLogin, projects.hasApproveAuthorization, projects.approveGateReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/reject')
        .put(users.requiresLogin, projects.hasApproveAuthorization, projects.rejectGateReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/draft')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.draftGateReview);

    // Gate Reviews Header, Status, Budget

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/header')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateGateReviewHeader);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/state')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable,  projects.updateGateStateReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/budget')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateGateBudgetReview);

    // Gate Reviews Outcomes

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/outcome-score-reviews/:outcomeScoreReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateOutcomeScoreReview);

    // Gate Reviews Baseline

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/baseline-duration-reviews/:baselineDurationReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateBaselineDurationReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/baseline-cost-reviews/:baselineCostReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateBaselineCostReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/baseline-completion-reviews/:baselineCompletionReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateBaselineCompletionReview);

    // Gate Reviews Estimate

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/estimate-duration-reviews/:estimateDurationReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateEstimateDurationReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/estimate-cost-reviews/:estimateCostReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateEstimateCostReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/estimate-completion-reviews/:estimateCompletionReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateEstimateCompletionReview);

    // Gate Reviews Actual

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/actual-duration-reviews/:actualDurationReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateActualDurationReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/actual-cost-reviews/:actualCostReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateActualCostReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/actual-completion-reviews/:actualCompletionReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateActualCompletionReview);


    // -------------------------- CHANGE REQUESTS -----------------------------

    // Change Requests

    app.route('/projects/:projectId/project-gates/:projectGateId/createChangeRequest')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.createChangeRequest);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/delete')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.deleteChangeRequest);

    // Change Requests - Approval

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/submit')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.submitChangeRequest);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/approve')
        .put(users.requiresLogin, projects.hasApproveAuthorization, projects.approveChangeRequest);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/reject')
        .put(users.requiresLogin, projects.hasApproveAuthorization, projects.rejectChangeRequest);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/draft')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.draftChangeRequest);

    // Change Requests - Header, Status

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/header')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isChangeRequestEditable, projects.updateChangeRequestHeader);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/status')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isChangeRequestEditable,  projects.updateChangeRequestStatus);

    // Change Requests - Budget

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/budget')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isChangeRequestEditable, projects.updateGateBudgetReviewForCR);

    // Change Requests - Baseline

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/baseline-duration-reviews/:baselineDurationReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isChangeRequestEditable, projects.updateBaselineDurationReviewForCR);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/baseline-cost-reviews/:baselineCostReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isChangeRequestEditable, projects.updateBaselineCostReviewForCR);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/baseline-completion-reviews/:baselineCompletionReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isChangeRequestEditable, projects.updateBaselineCompletionReviewForCR);

    // Change Requests - Actual

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/actual-duration-reviews/:actualDurationReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isChangeRequestEditable, projects.updateActualDurationReviewForCR);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/actual-cost-reviews/:actualCostReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isChangeRequestEditable, projects.updateActualCostReviewForCR);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-change-requests/:projectChangeRequestId/actual-completion-reviews/:actualCompletionReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isChangeRequestEditable, projects.updateActualCompletionReviewForCR);



    // -------------------------- PROJECT STATUS UPDATES -----------------------------


    // Status Updates

    app.route('/projects/:projectId/project-gates/:projectGateId/createStatusUpdate')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.createStatusUpdate);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/delete')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.deleteStatusUpdate);

    // Status Updates - Approval

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/submit')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.submitStatusUpdate);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/approve')
        .put(users.requiresLogin, projects.hasApproveAuthorization, projects.approveStatusUpdate);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/reject')
        .put(users.requiresLogin, projects.hasApproveAuthorization, projects.rejectStatusUpdate);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/draft')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.draftStatusUpdate);

    // Status Updates - Header

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/header')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateStatusUpdateHeader);

    // Status Updates - Delivery Status

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/overallDeliveryStatus')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateOverallDeliveryStatus);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/durationDeliveryStatus')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateDurationDeliveryStatus);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/costDeliveryStatus')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateCostDeliveryStatus);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/completionDeliveryStatus')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateCompletionDeliveryStatus);

    // Status Updates - Log Status Areas

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/status-area-reviews/:statusAreaReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateStatusAreaReview);
    

    // Status Updates - Outcomes

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/outcome-status-reviews/:outcomeStatusReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateOutcomeStatusReview);

    // Status Updates - Estimate

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/estimate-duration-reviews/:estimateDurationReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateEstimateDurationReviewForSU);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/estimate-cost-reviews/:estimateCostReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateEstimateCostReviewForSU);

    app.route('/projects/:projectId/project-gates/:projectGateId/project-status-updates/:projectStatusUpdateId/estimate-completion-reviews/:estimateCompletionReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isStatusUpdateEditable, projects.updateEstimateCompletionReviewForSU);


    // -------------------------- MIDDLEWARE -----------------------------

    // Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
};
