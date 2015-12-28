'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectGateStatuses = require('../../app/controllers/project-gate-statuses.server.controller');

	// Project gate statuses Routes
	app.route('/project-gate-statuses')
		.get(projectGateStatuses.list)
		.post(users.requiresLogin, projectGateStatuses.create);

	app.route('/project-gate-statuses/:projectGateStatusId')
		.get(projectGateStatuses.read)
		.put(users.requiresLogin, projectGateStatuses.hasAuthorization, projectGateStatuses.update)
		.delete(users.requiresLogin, projectGateStatuses.hasAuthorization, projectGateStatuses.delete);

	// Finish by binding the Project gate status middleware
	app.param('projectGateStatusId', projectGateStatuses.projectGateStatusByID);
};
