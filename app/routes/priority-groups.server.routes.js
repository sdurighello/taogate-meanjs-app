'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var priorityGroups = require('../../app/controllers/priority-groups.server.controller');

	// Priority groups Routes
	app.route('/priority-groups')
		.get(users.requiresLogin, priorityGroups.list)
		.post(users.requiresLogin, priorityGroups.hasAuthorization, priorityGroups.create);

	app.route('/priority-groups/:priorityGroupId')
		.get(users.requiresLogin, priorityGroups.read)
		.put(users.requiresLogin, priorityGroups.hasAuthorization, priorityGroups.update)
		.delete(users.requiresLogin, priorityGroups.hasAuthorization, priorityGroups.delete);

	// Finish by binding the Priority group middleware
	app.param('priorityGroupId', priorityGroups.priorityGroupByID);
};
