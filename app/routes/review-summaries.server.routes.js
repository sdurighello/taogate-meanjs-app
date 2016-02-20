'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var reviewSummaries = require('../../app/controllers/review-summaries.server.controller');

	app.route('/review-summaries/projectReviews')
		.get(users.requiresLogin, reviewSummaries.hasAuthorization, reviewSummaries.projectReviews);

	app.route('/review-summaries/portfolioReviews')
		.get(users.requiresLogin, reviewSummaries.hasAuthorization, reviewSummaries.portfolioReviews);
};
