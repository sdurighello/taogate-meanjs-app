'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioIssues = require('../../app/controllers/portfolio-issues.server.controller');

	// Portfolio issues Routes
	app.route('/portfolio-issues')
		.get(users.requiresLogin, portfolioIssues.list)
		.post(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.create);

	app.route('/portfolio-issues/:portfolioIssueId')
		.get(users.requiresLogin, portfolioIssues.read)
		.put(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.update)
		.delete(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.delete);

	// Header
	app.route('/portfolio-issues/:portfolioIssueId/header')
		.put(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.updateHeader);

	// Status
	app.route('/portfolio-issues/:portfolioIssueId/status')
		.put(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.updateStatus);

	// Create new action
	app.route('/portfolio-issues/:portfolioIssueId/createAction')
		.post(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.createAction);

	// Finish by binding the Portfolio issue middleware
	app.param('portfolioIssueId', portfolioIssues.portfolioIssueByID);
};
