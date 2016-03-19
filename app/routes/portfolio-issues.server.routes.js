'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioIssues = require('../../app/controllers/portfolio-issues.server.controller');

// **************** ISSUE ******************

	app.route('/portfolio-issues')
		.get(users.requiresLogin, portfolioIssues.list)
		.post(users.requiresLogin, portfolioIssues.hasCreateAuthorization, portfolioIssues.create);

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

// **************** ACTION ******************

	// Create new action
	app.route('/portfolio-issues/:portfolioIssueId/createAction')
		.post(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.createAction);

	// Action Header
	app.route('/portfolio-issues/:portfolioIssueId/escalationActions/:escalationActionId/actionHeader')
		.put(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.updateActionHeader);

	// Action Status
	app.route('/portfolio-issues/:portfolioIssueId/escalationActions/:escalationActionId/actionStatus')
		.put(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.updateActionStatus);

    // Delete action
    app.route('/portfolio-issues/:portfolioIssueId/escalationActions/:escalationActionId/deleteAction')
        .put(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.deleteAction);

// **************** ASSOCIATED PROJECT ISSUES ******************

    // Available project issues
    app.route('/portfolio-issues/:portfolioIssueId/portfolios/:portfolioId')
        .get(users.requiresLogin, portfolioIssues.availableProjectIssues);

    // Add associated project issue
    app.route('/portfolio-issues/:portfolioIssueId/project-issues/:projectIssueId/addProjectIssue')
        .put(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.addProjectIssue);

    // Remove associated project issue
    app.route('/portfolio-issues/:portfolioIssueId/project-issues/:projectIssueId/removeProjectIssue')
        .put(users.requiresLogin, portfolioIssues.hasAuthorization, portfolioIssues.removeProjectIssue);

// **************** MIDDLEWARE ******************

	// Finish by binding the Portfolio issue middleware
	app.param('portfolioIssueId', portfolioIssues.portfolioIssueByID);
};
