'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var issueActionStates = require('../../app/controllers/issue-action-states.server.controller');

	// Issue action states Routes
	app.route('/issue-action-states')
		.get(issueActionStates.list)
		.post(users.requiresLogin, issueActionStates.create);

	app.route('/issue-action-states/:issueActionStateId')
		.get(issueActionStates.read)
		.put(users.requiresLogin, issueActionStates.hasAuthorization, issueActionStates.update)
		.delete(users.requiresLogin, issueActionStates.hasAuthorization, issueActionStates.delete);

	// Finish by binding the Issue action state middleware
	app.param('issueActionStateId', issueActionStates.issueActionStateByID);
};
