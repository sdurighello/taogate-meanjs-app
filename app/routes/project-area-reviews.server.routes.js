'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectAreaReviews = require('../../app/controllers/project-area-reviews.server.controller');

	// Project area reviews Routes
	app.route('/project-area-reviews')
		.get(users.requiresLogin, projectAreaReviews.list)
		.post(users.requiresLogin, projectAreaReviews.hasAuthorization, projectAreaReviews.create);

	app.route('/project-area-reviews/:projectAreaReviewId')
		.get(users.requiresLogin, projectAreaReviews.read)
		.put(users.requiresLogin, projectAreaReviews.hasAuthorization, projectAreaReviews.update)
		.delete(users.requiresLogin, projectAreaReviews.hasAuthorization, projectAreaReviews.delete);

	// Finish by binding the Project area review middleware
	app.param('projectAreaReviewId', projectAreaReviews.projectAreaReviewByID);
};
