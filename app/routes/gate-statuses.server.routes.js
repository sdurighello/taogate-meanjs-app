'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateStatuses = require('../../app/controllers/gate-statuses.server.controller');

	// Gate statuses Routes
	app.route('/gate-statuses')
		.get(users.requiresLogin, gateStatuses.list)
		.post(users.requiresLogin, gateStatuses.hasAuthorization, gateStatuses.create);

	app.route('/gate-statuses/:gateStatusId')
		.get(users.requiresLogin, gateStatuses.read)
		.put(users.requiresLogin, gateStatuses.hasAuthorization, gateStatuses.update)
		.delete(users.requiresLogin, gateStatuses.hasAuthorization, gateStatuses.delete);

	// Finish by binding the Gate status middleware
	app.param('gateStatusId', gateStatuses.gateStatusByID);
};
