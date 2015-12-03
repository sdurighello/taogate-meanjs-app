'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectStatuses = require('../../app/controllers/project-statuses.server.controller');

	// Project statuses Routes
	app.route('/project-statuses')
		.get(projectStatuses.list)
		.post(users.requiresLogin, projectStatuses.create);

	app.route('/project-statuses/:projectStatusId')
		.get(projectStatuses.read)
		.put(users.requiresLogin, projectStatuses.hasAuthorization, projectStatuses.update)
		.delete(users.requiresLogin, projectStatuses.hasAuthorization, projectStatuses.delete);

	// Finish by binding the Project status middleware
	app.param('projectStatusId', projectStatuses.projectStatusByID);
};
