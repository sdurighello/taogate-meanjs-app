'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateOutcomes = require('../../app/controllers/gate-outcomes.server.controller');

	// Gate outcomes Routes
	app.route('/gate-outcomes')
		.get(users.requiresLogin, gateOutcomes.list)
		.post(users.requiresLogin, gateOutcomes.hasAuthorization, gateOutcomes.create);

	app.route('/gate-outcomes/:gateOutcomeId')
		.get(users.requiresLogin, gateOutcomes.read)
		.put(users.requiresLogin, gateOutcomes.hasAuthorization, gateOutcomes.update)
		.delete(users.requiresLogin, gateOutcomes.hasAuthorization, gateOutcomes.delete);

	// Finish by binding the Gate outcome middleware
	app.param('gateOutcomeId', gateOutcomes.gateOutcomeByID);
};
