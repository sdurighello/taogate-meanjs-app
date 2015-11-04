'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioTypes = require('../../app/controllers/portfolio-types.server.controller');

	// Portfolio types Routes
	app.route('/portfolio-types')
		.get(users.requiresLogin, portfolioTypes.list)
		.post(users.requiresLogin, portfolioTypes.hasAuthorization, portfolioTypes.create);

	app.route('/portfolio-types/:portfolioTypeId')
		.get(users.requiresLogin, portfolioTypes.read)
		.put(users.requiresLogin, portfolioTypes.hasAuthorization, portfolioTypes.update)
		.delete(users.requiresLogin, portfolioTypes.hasAuthorization, portfolioTypes.delete);

	// Finish by binding the Portfolio type middleware
	app.param('portfolioTypeId', portfolioTypes.portfolioTypeByID);
};
