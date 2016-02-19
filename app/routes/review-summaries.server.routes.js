'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var reviewSummaries = require('../../app/controllers/review-summaries.server.controller');

	app.route('/review-summaries/portfolioSummary')
		.get(users.requiresLogin, reviewSummaries.hasAuthorization, reviewSummaries.portfolioSummary);
};
