'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var financialCosts = require('../../app/controllers/financial-costs.server.controller');

	// Financial costs Routes
	app.route('/financial-costs')
		.get(users.requiresLogin, financialCosts.list)
		.post(users.requiresLogin, financialCosts.hasAuthorization, financialCosts.create);

	app.route('/financial-costs/:financialCostId')
		.get(users.requiresLogin, financialCosts.read)
		.put(users.requiresLogin, financialCosts.hasAuthorization, financialCosts.update)
		.delete(users.requiresLogin, financialCosts.hasAuthorization, financialCosts.delete);

	// Finish by binding the Financial cost middleware
	app.param('financialCostId', financialCosts.financialCostByID);
};
