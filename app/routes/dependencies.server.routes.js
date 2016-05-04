'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var dependencies = require('../../app/controllers/dependencies.server.controller');

	// Dependencies Routes
	app.route('/dependencies')
		.get(users.requiresLogin, dependencies.list)
		.post(users.requiresLogin, dependencies.hasCreateAuthorization, dependencies.create);

	app.route('/dependencies/:dependencyId')
		.get(users.requiresLogin, dependencies.read)
		.put(users.requiresLogin, dependencies.hasEditAuthorization, dependencies.update)
		.delete(users.requiresLogin, dependencies.hasEditAuthorization, dependencies.delete);

	// Header
	app.route('/dependencies/:dependencyId/header')
		.put(users.requiresLogin, dependencies.hasEditAuthorization, dependencies.updateHeader);

	// Status
	app.route('/dependencies/:dependencyId/status')
		.put(users.requiresLogin, dependencies.hasEditAuthorization, dependencies.updateStatus);

    app.route('/dependencies-analysis')
        .get(users.requiresLogin, dependencies.getDependenciesAnalysis);

	// Finish by binding the Dependency middleware
	app.param('dependencyId', dependencies.dependencyByID);
};
