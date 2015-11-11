'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var logPriorities = require('../../app/controllers/log-priorities.server.controller');

	// Log priorities Routes
	app.route('/log-priorities')
		.get(users.requiresLogin, logPriorities.list)
		.post(users.requiresLogin, logPriorities.hasAuthorization, logPriorities.create);

	app.route('/log-priorities/:logPriorityId')
		.get(users.requiresLogin, logPriorities.read)
		.put(users.requiresLogin, logPriorities.hasAuthorization, logPriorities.update)
		.delete(users.requiresLogin, logPriorities.hasAuthorization, logPriorities.delete);

	// Finish by binding the Log priority middleware
	app.param('logPriorityId', logPriorities.logPriorityByID);
};
