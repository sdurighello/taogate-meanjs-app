'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateProcesses = require('../../app/controllers/gate-processes.server.controller');

	// Gate processes Routes
	app.route('/gate-processes')
		.get(users.requiresLogin, gateProcesses.list)
		.post(users.requiresLogin, gateProcesses.hasAuthorization, gateProcesses.create);

	app.route('/gate-processes/:gateProcessId')
		.get(users.requiresLogin, gateProcesses.read)
		.put(users.requiresLogin, gateProcesses.hasAuthorization, gateProcesses.update)
		.delete(users.requiresLogin, gateProcesses.hasAuthorization, gateProcesses.delete);

	// Finish by binding the Gate process middleware
	app.param('gateProcessId', gateProcesses.gateProcessByID);
};
