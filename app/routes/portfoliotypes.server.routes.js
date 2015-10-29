'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfoliotypes = require('../../app/controllers/portfoliotypes.server.controller');

	// Portfoliotypes Routes
	app.route('/portfoliotypes')
		.get(users.requiresLogin, portfoliotypes.list)
		.post(users.requiresLogin, portfoliotypes.hasAuthorization, portfoliotypes.create);

	app.route('/portfoliotypes/:portfoliotypeId')
		.get(users.requiresLogin, portfoliotypes.read)
		.put(users.requiresLogin, portfoliotypes.hasAuthorization, portfoliotypes.update)
		.delete(users.requiresLogin, portfoliotypes.hasAuthorization, portfoliotypes.delete);

	// Finish by binding the Portfoliotype middleware
	app.param('portfoliotypeId', portfoliotypes.portfoliotypeByID);
};
