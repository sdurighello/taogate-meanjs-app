'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var improvementTypes = require('../../app/controllers/improvement-types.server.controller');

	// Improvement types Routes
	app.route('/improvement-types')
		.get(users.requiresLogin, improvementTypes.list)
		.post(users.requiresLogin, improvementTypes.hasAuthorization, improvementTypes.create);

	app.route('/improvement-types/:improvementTypeId')
		.get(users.requiresLogin, improvementTypes.read)
		.put(users.requiresLogin, improvementTypes.hasAuthorization, improvementTypes.update)
		.delete(users.requiresLogin, improvementTypes.hasAuthorization, improvementTypes.delete);

	// Finish by binding the Improvement type middleware
	app.param('improvementTypeId', improvementTypes.improvementTypeByID);
};
