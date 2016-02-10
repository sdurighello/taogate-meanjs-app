'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dependencyStates = require('../../app/controllers/dependency-states.server.controller');

	// Dependency states Routes
	app.route('/dependency-states')
		.get(users.requiresLogin, dependencyStates.list)
		.post(users.requiresLogin, dependencyStates.hasAuthorization, dependencyStates.create);

	app.route('/dependency-states/:dependencyStateId')
		.get(users.requiresLogin, dependencyStates.read)
		.put(users.requiresLogin, dependencyStates.hasAuthorization, dependencyStates.update)
		.delete(users.requiresLogin, dependencyStates.hasAuthorization, dependencyStates.delete);

	// Finish by binding the Dependency state middleware
	app.param('dependencyStateId', dependencyStates.dependencyStateByID);
};
