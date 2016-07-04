'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateStates = require('../../app/controllers/gate-states.server.controller');

	// Gate states Routes
	app.route('/gate-states')
		.get(users.requiresLogin, gateStates.list)
		.post(users.requiresLogin, gateStates.hasAuthorization, gateStates.create);

	app.route('/gate-states/:gateStateId')
		.get(users.requiresLogin, gateStates.read)
		.put(users.requiresLogin, gateStates.hasAuthorization, gateStates.update)
		.delete(users.requiresLogin, gateStates.hasAuthorization, gateStates.delete);

	// Finish by binding the Gate state middleware
	app.param('gateStateId', gateStates.gateStateByID);
};
