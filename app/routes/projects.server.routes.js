'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projects = require('../../app/controllers/projects.server.controller');

	// Projects Routes
	app.route('/projects')
		.get(users.requiresLogin, projects.list)
		.post(users.requiresLogin, projects.hasAuthorization, projects.create);

	app.route('/projects/:projectId')
		.get(users.requiresLogin, projects.read)
		.put(users.requiresLogin, projects.hasAuthorization, projects.update)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

	// Category Assignment
	app.route('/projects/categoryAssignment/:projectId/:assignedGroupId/:assignedCategoryId/:valueId')
		.put(users.requiresLogin, projects.hasAuthorization, projects.updateCategoryAssignment);

    // Priority Assignment
    app.route('/projects/priorityAssignment/:projectId/:assignedGroupId/:assignedPriorityId/:valueId')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updatePriorityAssignment);

    // Impact Assignment
    app.route('/projects/impactAssignment/:projectId/:assignedGroupId/:assignedImpactId/:scoreId')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updateImpactAssignment);

    // Risk Assignment
    app.route('/projects/riskAssignment/:projectId/:assignedCategoryId/:assignedRiskId/:impactId/:probabilityId')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updateRiskAssignment);

    // Stakeholders
    app.route('/projects/:projectId/stakeholders/:assignedGroupId/:assignedRoleId')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updatePeopleAssignment);

    // Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
};
