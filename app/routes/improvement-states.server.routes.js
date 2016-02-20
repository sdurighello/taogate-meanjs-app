'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var improvementStates = require('../../app/controllers/improvement-states.server.controller');

	// Improvement states Routes
	app.route('/improvement-states')
		.get(users.requiresLogin, improvementStates.list)
		.post(users.requiresLogin, improvementStates.hasAuthorization, improvementStates.create);

	app.route('/improvement-states/:improvementStateId')
		.get(users.requiresLogin, improvementStates.read)
		.put(users.requiresLogin, improvementStates.hasAuthorization, improvementStates.update)
		.delete(users.requiresLogin, improvementStates.hasAuthorization, improvementStates.delete);

	// Finish by binding the Improvement state middleware
	app.param('improvementStateId', improvementStates.improvementStateByID);
};
