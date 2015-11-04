'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var financialBenefits = require('../../app/controllers/financial-benefits.server.controller');

	// Financial benefits Routes
	app.route('/financial-benefits')
		.get(users.requiresLogin, financialBenefits.list)
		.post(users.requiresLogin, financialBenefits.hasAuthorization, financialBenefits.create);

	app.route('/financial-benefits/:financialBenefitId')
		.get(users.requiresLogin, financialBenefits.read)
		.put(users.requiresLogin, financialBenefits.hasAuthorization, financialBenefits.update)
		.delete(users.requiresLogin, financialBenefits.hasAuthorization, financialBenefits.delete);

	// Finish by binding the Financial benefit middleware
	app.param('financialBenefitId', financialBenefits.financialBenefitByID);
};
