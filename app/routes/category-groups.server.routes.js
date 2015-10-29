'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var categoryGroups = require('../../app/controllers/category-groups.server.controller');

	// Category groups Routes
	app.route('/category-groups')
		.get(users.requiresLogin, categoryGroups.list)
		.post(users.requiresLogin, categoryGroups.hasAuthorization, categoryGroups.create);

	app.route('/category-groups/:categoryGroupId')
		.get(users.requiresLogin, categoryGroups.read)
		.put(users.requiresLogin, categoryGroups.hasAuthorization, categoryGroups.update)
		.delete(users.requiresLogin, categoryGroups.hasAuthorization, categoryGroups.delete);

	// Finish by binding the Category group middleware
	app.param('categoryGroupId', categoryGroups.categoryGroupByID);
};
