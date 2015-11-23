'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var financialBenefitTypes = require('../../app/controllers/financial-benefit-types.server.controller');

	// Financial benefit types Routes
	app.route('/financial-benefit-types')
		.get(users.requiresLogin, financialBenefitTypes.list)
		.post(users.requiresLogin, financialBenefitTypes.hasAuthorization, financialBenefitTypes.create);

	app.route('/financial-benefit-types/:financialBenefitTypeId')
		.get(users.requiresLogin, financialBenefitTypes.read)
		.put(users.requiresLogin, financialBenefitTypes.hasAuthorization, financialBenefitTypes.update)
		.delete(users.requiresLogin, financialBenefitTypes.hasAuthorization, financialBenefitTypes.delete);

	// Finish by binding the Financial benefit type middleware
	app.param('financialBenefitTypeId', financialBenefitTypes.financialBenefitTypeByID);
};
