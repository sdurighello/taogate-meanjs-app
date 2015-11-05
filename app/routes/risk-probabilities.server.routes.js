'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var riskProbabilities = require('../../app/controllers/risk-probabilities.server.controller');

	// Risk probabilities Routes
	app.route('/risk-probabilities')
		.get(riskProbabilities.list)
		.post(users.requiresLogin, riskProbabilities.create);

	app.route('/risk-probabilities/:riskProbabilityId')
		.get(riskProbabilities.read)
		.put(users.requiresLogin, riskProbabilities.hasAuthorization, riskProbabilities.update)
		.delete(users.requiresLogin, riskProbabilities.hasAuthorization, riskProbabilities.delete);

	// Finish by binding the Risk probability middleware
	app.param('riskProbabilityId', riskProbabilities.riskProbabilityByID);
};
