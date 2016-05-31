'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projects = require('../../app/controllers/projects.server.controller');


    // -------------------------- DEFINITION -----------------------------

	// Projects Routes
	app.route('/projects')
		.get(users.requiresLogin, projects.list)
		.post(users.requiresLogin, projects.hasCreateAuthorization, projects.create);

	app.route('/projects/:projectId')
		.get(users.requiresLogin, projects.read)
		.put(users.requiresLogin, projects.hasEditAuthorization, projects.update)
		.delete(users.requiresLogin, projects.hasEditAuthorization, projects.delete);

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


    // -------------------------- DELIVERY -----------------------------

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

    // Gate Reviews Header & Status

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/header')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateGateReviewHeader);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/status')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable,  projects.updateGateStatusReview);

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/budget')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateGateBudgetReview);

    // Gate Reviews Outcomes

    app.route('/projects/:projectId/project-gates/:projectGateId/gate-reviews/:gateReviewId/outcome-reviews/:outcomeReviewId')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.isGateReviewEditable, projects.updateOutcomeReview);

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


    // Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
};
