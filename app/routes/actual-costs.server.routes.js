'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var actualCosts = require('../../app/controllers/actual-costs.server.controller');

	// Actual costs Routes
	app.route('/actual-costs')
		.get(actualCosts.list)
		.post(users.requiresLogin, actualCosts.create);

	app.route('/actual-costs/:actualCostId')
		.get(actualCosts.read)
		.put(users.requiresLogin, actualCosts.hasAuthorization, actualCosts.update)
		.delete(users.requiresLogin, actualCosts.hasAuthorization, actualCosts.delete);

	// Finish by binding the Actual cost middleware
	app.param('actualCostId', actualCosts.actualCostByID);
};
