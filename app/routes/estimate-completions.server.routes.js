'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var estimateCompletions = require('../../app/controllers/estimate-completions.server.controller');

	// Estimate completions Routes
	app.route('/estimate-completions')
		.get(estimateCompletions.list)
		.post(users.requiresLogin, estimateCompletions.create);

	app.route('/estimate-completions/:estimateCompletionId')
		.get(estimateCompletions.read)
		.put(users.requiresLogin, estimateCompletions.hasAuthorization, estimateCompletions.update)
		.delete(users.requiresLogin, estimateCompletions.hasAuthorization, estimateCompletions.delete);

	// Finish by binding the Estimate completion middleware
	app.param('estimateCompletionId', estimateCompletions.estimateCompletionByID);
};
