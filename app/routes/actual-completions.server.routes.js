'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var actualCompletions = require('../../app/controllers/actual-completions.server.controller');

	// Actual completions Routes
	app.route('/actual-completions')
		.get(users.requiresLogin, actualCompletions.list)
		.post(users.requiresLogin, actualCompletions.hasAuthorization, actualCompletions.create);

	app.route('/actual-completions/:actualCompletionId')
		.get(users.requiresLogin, actualCompletions.read)
		.put(users.requiresLogin, actualCompletions.hasAuthorization, actualCompletions.update)
		.delete(users.requiresLogin, actualCompletions.hasAuthorization, actualCompletions.delete);

	// Finish by binding the Actual completion middleware
	app.param('actualCompletionId', actualCompletions.actualCompletionByID);
};
