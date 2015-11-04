'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var financialCostGroups = require('../../app/controllers/financial-cost-groups.server.controller');

	// Financial cost groups Routes
	app.route('/financial-cost-groups')
		.get(users.requiresLogin, financialCostGroups.list)
		.post(users.requiresLogin, financialCostGroups.hasAuthorization, financialCostGroups.create);

	app.route('/financial-cost-groups/:financialCostGroupId')
		.get(users.requiresLogin, financialCostGroups.read)
		.put(users.requiresLogin, financialCostGroups.hasAuthorization, financialCostGroups.update)
		.delete(users.requiresLogin, financialCostGroups.hasAuthorization, financialCostGroups.delete);

	// Finish by binding the Financial cost group middleware
	app.param('financialCostGroupId', financialCostGroups.financialCostGroupByID);
};
