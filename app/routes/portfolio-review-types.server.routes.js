'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioReviewTypes = require('../../app/controllers/portfolio-review-types.server.controller');

	// Portfolio review types Routes
	app.route('/portfolio-review-types')
		.get(users.requiresLogin, portfolioReviewTypes.list)
		.post(users.requiresLogin, portfolioReviewTypes.hasAuthorization, portfolioReviewTypes.create);

	app.route('/portfolio-review-types/:portfolioReviewTypeId')
		.get(users.requiresLogin, portfolioReviewTypes.read)
		.put(users.requiresLogin, portfolioReviewTypes.hasAuthorization, portfolioReviewTypes.update)
		.delete(users.requiresLogin, portfolioReviewTypes.hasAuthorization, portfolioReviewTypes.delete);

	// Finish by binding the Portfolio review type middleware
	app.param('portfolioReviewTypeId', portfolioReviewTypes.portfolioReviewTypeByID);
};
