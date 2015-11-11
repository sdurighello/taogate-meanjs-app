'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var logReasons = require('../../app/controllers/log-reasons.server.controller');

	// Log reasons Routes
	app.route('/log-reasons')
		.get(users.requiresLogin, logReasons.list)
		.post(users.requiresLogin, logReasons.hasAuthorization, logReasons.create);

	app.route('/log-reasons/:logReasonId')
		.get(users.requiresLogin, logReasons.read)
		.put(users.requiresLogin, logReasons.hasAuthorization, logReasons.update)
		.delete(users.requiresLogin, logReasons.hasAuthorization, logReasons.delete);

	// Finish by binding the Log reason middleware
	app.param('logReasonId', logReasons.logReasonByID);
};
