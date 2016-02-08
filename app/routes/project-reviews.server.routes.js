'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectReviews = require('../../app/controllers/project-reviews.server.controller');

	// Project reviews Routes
	app.route('/project-reviews')
		.get(users.requiresLogin, projectReviews.list)
		.post(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.create);

	app.route('/project-reviews/:projectReviewId')
		.get(users.requiresLogin, projectReviews.read)
		.put(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.update)
		.delete(users.requiresLogin, projectReviews.hasAuthorization, projectReviews.delete);

	// Finish by binding the Project review middleware
	app.param('projectReviewId', projectReviews.projectReviewByID);
};
