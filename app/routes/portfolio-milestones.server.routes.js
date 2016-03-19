'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioMilestones = require('../../app/controllers/portfolio-milestones.server.controller');

	// Portfolio milestones Routes
	app.route('/portfolio-milestones')
		.get(users.requiresLogin, portfolioMilestones.list)
		.post(users.requiresLogin, portfolioMilestones.hasCreateAuthorization, portfolioMilestones.create);

	app.route('/portfolio-milestones/:portfolioMilestoneId')
		.get(users.requiresLogin, portfolioMilestones.read)
		.put(users.requiresLogin, portfolioMilestones.hasAuthorization, portfolioMilestones.update)
		.delete(users.requiresLogin, portfolioMilestones.hasAuthorization, portfolioMilestones.delete);

    // Header
    app.route('/portfolio-milestones/:portfolioMilestoneId/header')
        .put(users.requiresLogin, portfolioMilestones.hasAuthorization, portfolioMilestones.updateHeader);

    // Status
    app.route('/portfolio-milestones/:portfolioMilestoneId/status')
        .put(users.requiresLogin, portfolioMilestones.hasAuthorization, portfolioMilestones.updateStatus);

// **************** ASSOCIATED PROJECT MILESTONES ******************

    // Available project milestones
    app.route('/portfolio-milestones/:portfolioMilestoneId/portfolios/:portfolioId')
        .get(users.requiresLogin, portfolioMilestones.availableProjectMilestones);

    // Add associated project milestones
    app.route('/portfolio-milestones/:portfolioMilestoneId/project-milestones/:projectMilestoneId/addProjectMilestone')
        .put(users.requiresLogin, portfolioMilestones.hasAuthorization, portfolioMilestones.addProjectMilestone);

    // Remove associated project milestones
    app.route('/portfolio-milestones/:portfolioMilestoneId/project-milestones/:projectMilestoneId/removeProjectMilestone')
        .put(users.requiresLogin, portfolioMilestones.hasAuthorization, portfolioMilestones.removeProjectMilestone);

// **************** MIDDLEWARE ******************

    // Finish by binding the Portfolio milestone middleware
	app.param('portfolioMilestoneId', portfolioMilestones.portfolioMilestoneByID);
};
