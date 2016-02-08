'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectReviewTypes = require('../../app/controllers/project-review-types.server.controller');

	// Project review types Routes
	app.route('/project-review-types')
		.get(users.requiresLogin, projectReviewTypes.list)
		.post(users.requiresLogin, projectReviewTypes.hasAuthorization, projectReviewTypes.create);

	app.route('/project-review-types/:projectReviewTypeId')
		.get(users.requiresLogin, projectReviewTypes.read)
		.put(users.requiresLogin, projectReviewTypes.hasAuthorization, projectReviewTypes.update)
		.delete(users.requiresLogin, projectReviewTypes.hasAuthorization, projectReviewTypes.delete);

	// Finish by binding the Project review type middleware
	app.param('projectReviewTypeId', projectReviewTypes.projectReviewTypeByID);
};
