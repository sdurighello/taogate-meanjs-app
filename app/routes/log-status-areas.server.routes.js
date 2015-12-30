'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var logStatusAreas = require('../../app/controllers/log-status-areas.server.controller');

	// Log status areas Routes
	app.route('/log-status-areas')
		.get(users.requiresLogin, logStatusAreas.list)
		.post(users.requiresLogin, logStatusAreas.hasAuthorization, logStatusAreas.create);

	app.route('/log-status-areas/:logStatusAreaId')
		.get(users.requiresLogin, logStatusAreas.read)
		.put(users.requiresLogin, logStatusAreas.hasAuthorization, logStatusAreas.update)
		.delete(users.requiresLogin, logStatusAreas.hasAuthorization, logStatusAreas.delete);

	// Finish by binding the Log status area middleware
	app.param('logStatusAreaId', logStatusAreas.logStatusAreaByID);
};
