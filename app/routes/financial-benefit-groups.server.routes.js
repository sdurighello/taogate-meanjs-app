'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var financialBenefitGroups = require('../../app/controllers/financial-benefit-groups.server.controller');

	// Financial benefit groups Routes
	app.route('/financial-benefit-groups')
		.get(users.requiresLogin, financialBenefitGroups.list)
		.post(users.requiresLogin, financialBenefitGroups.hasAuthorization, financialBenefitGroups.create);

	app.route('/financial-benefit-groups/:financialBenefitGroupId')
		.get(users.requiresLogin, financialBenefitGroups.read)
		.put(users.requiresLogin, financialBenefitGroups.hasAuthorization, financialBenefitGroups.update)
		.delete(users.requiresLogin, financialBenefitGroups.hasAuthorization, financialBenefitGroups.delete);

	// Finish by binding the Financial benefit group middleware
	app.param('financialBenefitGroupId', financialBenefitGroups.financialBenefitGroupByID);
};
