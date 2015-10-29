'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var priorityValues = require('../../app/controllers/priority-values.server.controller');

	// Priority values Routes
	app.route('/priority-values')
		.get(users.requiresLogin, priorityValues.list)
		.post(users.requiresLogin, priorityValues.hasAuthorization, priorityValues.create);

	app.route('/priority-values/:priorityValueId')
		.get(users.requiresLogin, priorityValues.read)
		.put(users.requiresLogin, priorityValues.hasAuthorization, priorityValues.update)
		.delete(users.requiresLogin, priorityValues.hasAuthorization, priorityValues.delete);

	// Finish by binding the Priority value middleware
	app.param('priorityValueId', priorityValues.priorityValueByID);
};
