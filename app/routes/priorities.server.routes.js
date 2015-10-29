'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var priorities = require('../../app/controllers/priorities.server.controller');

	// Priorities Routes
	app.route('/priorities')
		.get(users.requiresLogin, priorities.list)
		.post(users.requiresLogin, priorities.hasAuthorization, priorities.create);

	app.route('/priorities/:priorityId')
		.get(users.requiresLogin, priorities.read)
		.put(users.requiresLogin, priorities.hasAuthorization, priorities.update)
		.delete(users.requiresLogin, priorities.hasAuthorization, priorities.delete);

	// Finish by binding the Priority middleware
	app.param('priorityId', priorities.priorityByID);
};
