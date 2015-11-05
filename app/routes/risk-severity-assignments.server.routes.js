'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var riskSeverityAssignments = require('../../app/controllers/risk-severity-assignments.server.controller');

	// Risk severity assignments Routes
	app.route('/risk-severity-assignments')
		.get(riskSeverityAssignments.list)
		.post(users.requiresLogin, riskSeverityAssignments.create);

	app.route('/risk-severity-assignments/:riskSeverityAssignmentId')
		.get(riskSeverityAssignments.read)
		.put(users.requiresLogin, riskSeverityAssignments.hasAuthorization, riskSeverityAssignments.update)
		.delete(users.requiresLogin, riskSeverityAssignments.hasAuthorization, riskSeverityAssignments.delete);

	// Finish by binding the Risk severity assignment middleware
	app.param('riskSeverityAssignmentId', riskSeverityAssignments.riskSeverityAssignmentByID);
};
