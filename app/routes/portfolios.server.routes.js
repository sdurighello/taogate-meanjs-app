'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolios = require('../../app/controllers/portfolios.server.controller');

	// Portfolios Routes
	app.route('/portfolios')
		.get(users.requiresLogin, portfolios.list)
		.post(users.requiresLogin, portfolios.hasCreateAuthorization, portfolios.create);

	app.route('/portfolios/:portfolioId')
		.get(users.requiresLogin, portfolios.read)
		.put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.update)
		.delete(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.delete);
 
	// Stakeholders
	app.route('/portfolios/:portfolioId/stakeholders/:assignedGroupId/:assignedRoleId')
		.put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.updatePeopleAssignment);

    
    // -------------------------- STATUS UPDATES -----------------------------

    // Status Updates

    app.route('/portfolios/:portfolioId/createStatusUpdate')
        .put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.createStatusUpdate);

    app.route('/portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/delete')
        .put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.deleteStatusUpdate);

    // Status Updates - Header

    app.route('/portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/header')
        .put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.isStatusUpdateEditable, portfolios.updateStatusUpdateHeader);

    // Status Updates - Budget

    app.route('/portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/budget')
        .put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.isStatusUpdateEditable, portfolios.updateStatusUpdateBudget);

    // Status Updates - Delivery Status

    app.route('/portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/overallDeliveryStatus')
        .put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.isStatusUpdateEditable, portfolios.updateOverallDeliveryStatus);

    app.route('/portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/status-area-reviews/:statusAreaReviewId')
        .put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.isStatusUpdateEditable, portfolios.updateStatusAreaReview);


    // Status Updates - Approval

    app.route('/portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/submit')
        .put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.submitStatusUpdate);

    app.route('/portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/approve')
        .put(users.requiresLogin, portfolios.hasApproveAuthorization, portfolios.approveStatusUpdate);

    app.route('/portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/reject')
        .put(users.requiresLogin, portfolios.hasApproveAuthorization, portfolios.rejectStatusUpdate);

    app.route('/portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/draft')
        .put(users.requiresLogin, portfolios.hasEditAuthorization, portfolios.draftStatusUpdate);


    // Finish by binding the Portfolio middleware
	app.param('portfolioId', portfolios.portfolioByID);
};
