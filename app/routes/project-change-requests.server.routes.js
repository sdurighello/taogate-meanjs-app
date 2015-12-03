'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectChangeRequests = require('../../app/controllers/project-change-requests.server.controller');

	// Project change requests Routes
	app.route('/project-change-requests')
		.get(projectChangeRequests.list)
		.post(users.requiresLogin, projectChangeRequests.create);

	app.route('/project-change-requests/:projectChangeRequestId')
		.get(projectChangeRequests.read)
		.put(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.update)
		.delete(users.requiresLogin, projectChangeRequests.hasAuthorization, projectChangeRequests.delete);

	// Finish by binding the Project change request middleware
	app.param('projectChangeRequestId', projectChangeRequests.projectChangeRequestByID);
};
