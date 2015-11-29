'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolios = require('../../app/controllers/portfolios.server.controller');

	// Portfolios Routes
	app.route('/portfolios')
		.get(users.requiresLogin, portfolios.list)
		.post(users.requiresLogin, portfolios.hasAuthorization, portfolios.create);

	app.route('/portfolios/:portfolioId')
		.get(users.requiresLogin, portfolios.read)
		.put(users.requiresLogin, portfolios.hasAuthorization, portfolios.update)
		.delete(users.requiresLogin, portfolios.hasAuthorization, portfolios.delete);

	// Stakeholders
	app.route('/portfolios/:portfolioId/stakeholders/:assignedGroupId/:assignedRoleId')
		.put(users.requiresLogin, portfolios.hasAuthorization, portfolios.updatePeopleAssignment);

	// Finish by binding the Portfolio middleware
	app.param('portfolioId', portfolios.portfolioByID);
};
