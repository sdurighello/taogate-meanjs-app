'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var peopleCategories = require('../../app/controllers/people-categories.server.controller');

	// People categories Routes
	app.route('/people-categories')
		.get(users.requiresLogin, peopleCategories.list)
		.post(users.requiresLogin, peopleCategories.hasAuthorization, peopleCategories.create);

	app.route('/people-categories/:peopleCategoryId')
		.get(users.requiresLogin, peopleCategories.read)
		.put(users.requiresLogin, peopleCategories.hasAuthorization, peopleCategories.update)
		.delete(users.requiresLogin, peopleCategories.hasAuthorization, peopleCategories.delete);

	// Finish by binding the People category middleware
	app.param('peopleCategoryId', peopleCategories.peopleCategoryByID);
};
