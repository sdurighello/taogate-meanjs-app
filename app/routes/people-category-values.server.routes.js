'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var peopleCategoryValues = require('../../app/controllers/people-category-values.server.controller');

	// People category values Routes
	app.route('/people-category-values')
		.get(users.requiresLogin, peopleCategoryValues.list)
		.post(users.requiresLogin, peopleCategoryValues.hasAuthorization, peopleCategoryValues.create);

	app.route('/people-category-values/:peopleCategoryValueId')
		.get(users.requiresLogin, peopleCategoryValues.read)
		.put(users.requiresLogin, peopleCategoryValues.hasAuthorization, peopleCategoryValues.update)
		.delete(users.requiresLogin, peopleCategoryValues.hasAuthorization, peopleCategoryValues.delete);

	// Finish by binding the People category value middleware
	app.param('peopleCategoryValueId', peopleCategoryValues.peopleCategoryValueByID);
};
