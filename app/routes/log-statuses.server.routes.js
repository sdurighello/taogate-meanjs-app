'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var logStatuses = require('../../app/controllers/log-statuses.server.controller');

	// Log statuses Routes
	app.route('/log-statuses')
		.get(users.requiresLogin, logStatuses.list)
		.post(users.requiresLogin, logStatuses.hasAuthorization, logStatuses.create);

	app.route('/log-statuses/:logStatusId')
		.get(users.requiresLogin, logStatuses.read)
		.put(users.requiresLogin, logStatuses.hasAuthorization, logStatuses.update)
		.delete(users.requiresLogin, logStatuses.hasAuthorization, logStatuses.delete);

	// Finish by binding the Log status middleware
	app.param('logStatusId', logStatuses.logStatusByID);
};
