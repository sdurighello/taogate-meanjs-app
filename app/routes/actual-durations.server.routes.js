'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var actualDurations = require('../../app/controllers/actual-durations.server.controller');

	// Actual durations Routes
	app.route('/actual-durations')
		.get(actualDurations.list)
		.post(users.requiresLogin, actualDurations.create);

	app.route('/actual-durations/:actualDurationId')
		.get(actualDurations.read)
		.put(users.requiresLogin, actualDurations.hasAuthorization, actualDurations.update)
		.delete(users.requiresLogin, actualDurations.hasAuthorization, actualDurations.delete);

	// Finish by binding the Actual duration middleware
	app.param('actualDurationId', actualDurations.actualDurationByID);
};
