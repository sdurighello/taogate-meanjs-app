'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dependencyTypes = require('../../app/controllers/dependency-types.server.controller');

	// Dependency types Routes
	app.route('/dependency-types')
		.get(users.requiresLogin, dependencyTypes.list)
		.post(users.requiresLogin, dependencyTypes.hasAuthorization, dependencyTypes.create);

	app.route('/dependency-types/:dependencyTypeId')
		.get(users.requiresLogin, dependencyTypes.read)
		.put(users.requiresLogin, dependencyTypes.hasAuthorization, dependencyTypes.update)
		.delete(users.requiresLogin, dependencyTypes.hasAuthorization, dependencyTypes.delete);

	// Finish by binding the Dependency type middleware
	app.param('dependencyTypeId', dependencyTypes.dependencyTypeByID);
};
