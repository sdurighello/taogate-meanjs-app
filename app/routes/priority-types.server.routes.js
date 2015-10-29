'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var priorityTypes = require('../../app/controllers/priority-types.server.controller');

	// Priority types Routes
	app.route('/priority-types')
		.get(priorityTypes.list)
		.post(users.requiresLogin, priorityTypes.create);

	app.route('/priority-types/:priorityTypeId')
		.get(priorityTypes.read)
		.put(users.requiresLogin, priorityTypes.hasAuthorization, priorityTypes.update)
		.delete(users.requiresLogin, priorityTypes.hasAuthorization, priorityTypes.delete);

	// Finish by binding the Priority type middleware
	app.param('priorityTypeId', priorityTypes.priorityTypeByID);
};
