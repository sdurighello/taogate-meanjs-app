'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var financialCostTypes = require('../../app/controllers/financial-cost-types.server.controller');

	// Financial cost types Routes
	app.route('/financial-cost-types')
		.get(users.requiresLogin, financialCostTypes.list)
		.post(users.requiresLogin, financialCostTypes.hasAuthorization, users.requiresLogin, financialCostTypes.create);

	app.route('/financial-cost-types/:financialCostTypeId')
		.get(users.requiresLogin, financialCostTypes.read)
		.put(users.requiresLogin, financialCostTypes.hasAuthorization, financialCostTypes.update)
		.delete(users.requiresLogin, financialCostTypes.hasAuthorization, financialCostTypes.delete);

	// Finish by binding the Financial cost type middleware
	app.param('financialCostTypeId', financialCostTypes.financialCostTypeByID);
};
