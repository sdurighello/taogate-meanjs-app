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

    // Gate process
    app.route('/projects/:projectId/process')
        .put(users.requiresLogin, projects.hasEditAuthorization, projects.updateProcessAssignment);


    // Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
};
