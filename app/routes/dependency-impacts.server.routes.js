'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dependencyImpacts = require('../../app/controllers/dependency-impacts.server.controller');

	// Dependency impacts Routes
	app.route('/dependency-impacts')
		.get(users.requiresLogin, dependencyImpacts.list)
		.post(users.requiresLogin, dependencyImpacts.hasAuthorization, dependencyImpacts.create);

	app.route('/dependency-impacts/:dependencyImpactId')
		.get(users.requiresLogin, dependencyImpacts.read)
		.put(users.requiresLogin, dependencyImpacts.hasAuthorization, dependencyImpacts.update)
		.delete(users.requiresLogin, dependencyImpacts.hasAuthorization, dependencyImpacts.delete);

	// Finish by binding the Dependency impact middleware
	app.param('dependencyImpactId', dependencyImpacts.dependencyImpactByID);
};
