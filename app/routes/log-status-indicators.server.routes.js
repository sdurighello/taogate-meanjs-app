'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var logStatusIndicators = require('../../app/controllers/log-status-indicators.server.controller');

	// Log statuses Routes
	app.route('/log-status-indicators')
		.get(users.requiresLogin, logStatusIndicators.list)
		.post(users.requiresLogin, logStatusIndicators.hasAuthorization, logStatusIndicators.create);

	app.route('/log-status-indicators/:logStatusIndicatorId')
		.get(users.requiresLogin, logStatusIndicators.read)
		.put(users.requiresLogin, logStatusIndicators.hasAuthorization, logStatusIndicators.update)
		.delete(users.requiresLogin, logStatusIndicators.hasAuthorization, logStatusIndicators.delete);

	// Finish by binding the Log status middleware
	app.param('logStatusIndicatorId', logStatusIndicators.logStatusIndicatorByID);
};
