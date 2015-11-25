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

	// Category & Priority assignment & Impact assignment
	app.route('/projects/categoryAssignment/:projectId/:assignedGroupId/:assignedCategoryId/:valueId')
		.put(users.requiresLogin, projects.hasAuthorization, projects.updateCategoryAssignment);

    app.route('/projects/priorityAssignment/:projectId/:assignedGroupId/:assignedPriorityId/:valueId')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updatePriorityAssignment);

    app.route('/projects/impactAssignment/:projectId/:assignedGroupId/:assignedImpactId/:scoreId')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updateImpactAssignment);


	// Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
};
