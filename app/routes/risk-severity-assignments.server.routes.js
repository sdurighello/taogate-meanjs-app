'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var riskSeverityAssignments = require('../../app/controllers/risk-severity-assignments.server.controller');

	// Risk severity assignments Routes
	app.route('/risk-severity-assignments')
		.get(users.requiresLogin, riskSeverityAssignments.list)
		.post(users.requiresLogin, riskSeverityAssignments.hasAuthorization, riskSeverityAssignments.create);

	app.route('/risk-severity-assignments/:riskSeverityAssignmentId')
		.get(users.requiresLogin, riskSeverityAssignments.read)
		.put(users.requiresLogin, riskSeverityAssignments.hasAuthorization, riskSeverityAssignments.update)
		.delete(users.requiresLogin, riskSeverityAssignments.hasAuthorization, riskSeverityAssignments.delete);

	// Finish by binding the Risk severity assignment middleware
	app.param('riskSeverityAssignmentId', riskSeverityAssignments.riskSeverityAssignmentByID);
};
