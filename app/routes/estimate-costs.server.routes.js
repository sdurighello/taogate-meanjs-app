'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var estimateCosts = require('../../app/controllers/estimate-costs.server.controller');

	// Estimate costs Routes
	app.route('/estimate-costs')
		.get(estimateCosts.list)
		.post(users.requiresLogin, estimateCosts.create);

	app.route('/estimate-costs/:estimateCostId')
		.get(estimateCosts.read)
		.put(users.requiresLogin, estimateCosts.hasAuthorization, estimateCosts.update)
		.delete(users.requiresLogin, estimateCosts.hasAuthorization, estimateCosts.delete);

	// Finish by binding the Estimate cost middleware
	app.param('estimateCostId', estimateCosts.estimateCostByID);
};
