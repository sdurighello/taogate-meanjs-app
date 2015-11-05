'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var riskImpacts = require('../../app/controllers/risk-impacts.server.controller');

	// Risk impacts Routes
	app.route('/risk-impacts')
		.get(riskImpacts.list)
		.post(users.requiresLogin, riskImpacts.create);

	app.route('/risk-impacts/:riskImpactId')
		.get(riskImpacts.read)
		.put(users.requiresLogin, riskImpacts.hasAuthorization, riskImpacts.update)
		.delete(users.requiresLogin, riskImpacts.hasAuthorization, riskImpacts.delete);

	// Finish by binding the Risk impact middleware
	app.param('riskImpactId', riskImpacts.riskImpactByID);
};
