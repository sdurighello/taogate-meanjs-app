'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioReviewTemplates = require('../../app/controllers/portfolio-review-templates.server.controller');

	// Portfolio review templates Routes
	app.route('/portfolio-review-templates')
		.get(users.requiresLogin, portfolioReviewTemplates.list)
		.post(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.create);

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId')
		.get(users.requiresLogin, portfolioReviewTemplates.read)
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.update)
		.delete(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.delete);

	// Finish by binding the Portfolio review template middleware
	app.param('portfolioReviewTemplateId', portfolioReviewTemplates.portfolioReviewTemplateByID);
};
