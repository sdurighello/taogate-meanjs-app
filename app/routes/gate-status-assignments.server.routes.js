'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateStatusAssignments = require('../../app/controllers/gate-status-assignments.server.controller');

	// Gate status assignments Routes
	app.route('/gate-status-assignments')
		.get(users.requiresLogin, gateStatusAssignments.list)
		.post(users.requiresLogin, gateStatusAssignments.hasAuthorization, gateStatusAssignments.create);

	app.route('/gate-status-assignments/:gateStatusAssignmentId')
		.get(users.requiresLogin, gateStatusAssignments.read)
		.put(users.requiresLogin, gateStatusAssignments.hasAuthorization, gateStatusAssignments.update)
		.delete(users.requiresLogin, gateStatusAssignments.hasAuthorization, gateStatusAssignments.delete);

	// Finish by binding the Gate status assignment middleware
	app.param('gateStatusAssignmentId', gateStatusAssignments.gateStatusAssignmentByID);
};
