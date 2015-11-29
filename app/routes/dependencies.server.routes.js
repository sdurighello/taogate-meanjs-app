'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dependencies = require('../../app/controllers/dependencies.server.controller');

	// Dependencies Routes
	app.route('/dependencies')
		.get(users.requiresLogin, dependencies.list)
		.post(users.requiresLogin, dependencies.hasAuthorization, dependencies.create);

	app.route('/dependencies/:dependencyId')
		.get(users.requiresLogin, dependencies.read)
		.put(users.requiresLogin, dependencies.hasAuthorization, dependencies.update)
		.delete(users.requiresLogin, dependencies.hasAuthorization, dependencies.delete);

	// Finish by binding the Dependency middleware
	app.param('dependencyId', dependencies.dependencyByID);
};
