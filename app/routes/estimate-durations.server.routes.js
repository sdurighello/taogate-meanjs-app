'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var estimateDurations = require('../../app/controllers/estimate-durations.server.controller');

	// Estimate durations Routes
	app.route('/estimate-durations')
		.get(users.requiresLogin, estimateDurations.list)
		.post(users.requiresLogin, estimateDurations.hasAuthorization, estimateDurations.create);

	app.route('/estimate-durations/:estimateDurationId')
		.get(users.requiresLogin, estimateDurations.read)
		.put(users.requiresLogin, estimateDurations.hasAuthorization, estimateDurations.update)
		.delete(users.requiresLogin, estimateDurations.hasAuthorization, estimateDurations.delete);

	// Finish by binding the Estimate duration middleware
	app.param('estimateDurationId', estimateDurations.estimateDurationByID);
};
