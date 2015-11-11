'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectMilestoneTypes = require('../../app/controllers/project-milestone-types.server.controller');

	// Project milestone types Routes
	app.route('/project-milestone-types')
		.get(users.requiresLogin, projectMilestoneTypes.list)
		.post(users.requiresLogin, projectMilestoneTypes.hasAuthorization, projectMilestoneTypes.create);

	app.route('/project-milestone-types/:projectMilestoneTypeId')
		.get(users.requiresLogin, projectMilestoneTypes.read)
		.put(users.requiresLogin, projectMilestoneTypes.hasAuthorization, projectMilestoneTypes.update)
		.delete(users.requiresLogin, projectMilestoneTypes.hasAuthorization, projectMilestoneTypes.delete);

	// Finish by binding the Project milestone type middleware
	app.param('projectMilestoneTypeId', projectMilestoneTypes.projectMilestoneTypeByID);
};
