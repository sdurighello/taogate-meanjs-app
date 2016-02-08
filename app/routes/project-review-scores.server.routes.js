'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectReviewScores = require('../../app/controllers/project-review-scores.server.controller');

	// Project review scores Routes
	app.route('/project-review-scores')
		.get(users.requiresLogin, projectReviewScores.list)
		.post(users.requiresLogin, projectReviewScores.hasAuthorization, projectReviewScores.create);

	app.route('/project-review-scores/:projectReviewScoreId')
		.get(users.requiresLogin, projectReviewScores.read)
		.put(users.requiresLogin, projectReviewScores.hasAuthorization, projectReviewScores.update)
		.delete(users.requiresLogin, projectReviewScores.hasAuthorization, projectReviewScores.delete);

	// Finish by binding the Project review score middleware
	app.param('projectReviewScoreId', projectReviewScores.projectReviewScoreByID);
};
