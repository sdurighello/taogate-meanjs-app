'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var baselineCosts = require('../../app/controllers/baseline-costs.server.controller');

	// Baseline costs Routes
	app.route('/baseline-costs')
		.get(users.requiresLogin, baselineCosts.list)
		.post(users.requiresLogin, baselineCosts.hasAuthorization, baselineCosts.create);

	app.route('/baseline-costs/:baselineCostId')
		.get(users.requiresLogin, baselineCosts.read)
		.put(users.requiresLogin, baselineCosts.hasAuthorization, baselineCosts.update)
		.delete(users.requiresLogin, baselineCosts.hasAuthorization, baselineCosts.delete);

	// Finish by binding the Baseline cost middleware
	app.param('baselineCostId', baselineCosts.baselineCostByID);
};
