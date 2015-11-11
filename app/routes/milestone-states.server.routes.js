'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var milestoneStates = require('../../app/controllers/milestone-states.server.controller');

	// Milestone states Routes
	app.route('/milestone-states')
		.get(users.requiresLogin, milestoneStates.list)
		.post(users.requiresLogin, milestoneStates.hasAuthorization, milestoneStates.create);

	app.route('/milestone-states/:milestoneStateId')
		.get(users.requiresLogin, milestoneStates.read)
		.put(users.requiresLogin, milestoneStates.hasAuthorization, milestoneStates.update)
		.delete(users.requiresLogin, milestoneStates.hasAuthorization, milestoneStates.delete);

	// Finish by binding the Milestone state middleware
	app.param('milestoneStateId', milestoneStates.milestoneStateByID);
};
