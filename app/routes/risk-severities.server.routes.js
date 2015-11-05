'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var riskSeverities = require('../../app/controllers/risk-severities.server.controller');

	// Risk severities Routes
	app.route('/risk-severities')
		.get(riskSeverities.list)
		.post(users.requiresLogin, riskSeverities.create);

	app.route('/risk-severities/:riskSeverityId')
		.get(riskSeverities.read)
		.put(users.requiresLogin, riskSeverities.hasAuthorization, riskSeverities.update)
		.delete(users.requiresLogin, riskSeverities.hasAuthorization, riskSeverities.delete);

	// Finish by binding the Risk severity middleware
	app.param('riskSeverityId', riskSeverities.riskSeverityByID);
};
