'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectMilestones = require('../../app/controllers/project-milestones.server.controller');

	// Project milestones Routes
	app.route('/project-milestones')
		.get(users.requiresLogin, projectMilestones.list)
		.post(users.requiresLogin, projectMilestones.hasCreateAuthorization, projectMilestones.create);

	app.route('/project-milestones/:projectMilestoneId')
		.get(users.requiresLogin, projectMilestones.read)
		.put(users.requiresLogin, projectMilestones.hasEditAuthorization, projectMilestones.update)
		.delete(users.requiresLogin, projectMilestones.hasEditAuthorization, projectMilestones.delete);

	// Header
	app.route('/project-milestones/:projectMilestoneId/header')
		.put(users.requiresLogin, projectMilestones.hasEditAuthorization, projectMilestones.updateHeader);

	// Status
	app.route('/project-milestones/:projectMilestoneId/status')
		.put(users.requiresLogin, projectMilestones.hasEditAuthorization, projectMilestones.updateStatus);


	// Finish by binding the Project milestone middleware
	app.param('projectMilestoneId', projectMilestones.projectMilestoneByID);
};
