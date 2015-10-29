'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var categoryValues = require('../../app/controllers/category-values.server.controller');

	// Category values Routes
	app.route('/category-values')
		.get(users.requiresLogin, categoryValues.list)
		.post(users.requiresLogin, categoryValues.hasAuthorization, categoryValues.create);

	app.route('/category-values/:categoryValueId')
		.get(users.requiresLogin, categoryValues.read)
		.put(users.requiresLogin, categoryValues.hasAuthorization, categoryValues.update)
		.delete(users.requiresLogin, categoryValues.hasAuthorization, categoryValues.delete);

	// Finish by binding the Category value middleware
	app.param('categoryValueId', categoryValues.categoryValueByID);
};
