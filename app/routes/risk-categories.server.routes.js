'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var riskCategories = require('../../app/controllers/risk-categories.server.controller');

	// Risk categories Routes
	app.route('/risk-categories')
		.get(riskCategories.list)
		.post(users.requiresLogin, riskCategories.create);

	app.route('/risk-categories/:riskCategoryId')
		.get(riskCategories.read)
		.put(users.requiresLogin, riskCategories.hasAuthorization, riskCategories.update)
		.delete(users.requiresLogin, riskCategories.hasAuthorization, riskCategories.delete);

	// Finish by binding the Risk category middleware
	app.param('riskCategoryId', riskCategories.riskCategoryByID);
};
