'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gates = require('../../app/controllers/gates.server.controller');

	// Gates Routes
	app.route('/gates')
		.get(users.requiresLogin, gates.list)
		.post(users.requiresLogin, gates.hasAuthorization, gates.create);

	app.route('/gates/:gateId')
		.get(users.requiresLogin, gates.read)
		.put(users.requiresLogin, gates.hasAuthorization, gates.update)
		.delete(users.requiresLogin, gates.hasAuthorization, gates.delete);

	// Finish by binding the Gate middleware
	app.param('gateId', gates.gateByID);
};
