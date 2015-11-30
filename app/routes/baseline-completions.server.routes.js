'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var baselineCompletions = require('../../app/controllers/baseline-completions.server.controller');

	// Baseline completions Routes
	app.route('/baseline-completions')
		.get(baselineCompletions.list)
		.post(users.requiresLogin, baselineCompletions.create);

	app.route('/baseline-completions/:baselineCompletionId')
		.get(baselineCompletions.read)
		.put(users.requiresLogin, baselineCompletions.hasAuthorization, baselineCompletions.update)
		.delete(users.requiresLogin, baselineCompletions.hasAuthorization, baselineCompletions.delete);

	// Finish by binding the Baseline completion middleware
	app.param('baselineCompletionId', baselineCompletions.baselineCompletionByID);
};
