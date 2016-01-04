'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectIssues = require('../../app/controllers/project-issues.server.controller');

	// Project issues Routes
	app.route('/project-issues')
		.get(users.requiresLogin, projectIssues.list)
		.post(users.requiresLogin, projectIssues.hasAuthorization, projectIssues.create);

	app.route('/project-issues/:projectIssueId')
		.get(users.requiresLogin, projectIssues.read)
		.put(users.requiresLogin, projectIssues.hasAuthorization, projectIssues.update)
		.delete(users.requiresLogin, projectIssues.hasAuthorization, projectIssues.delete);

	// Header
	app.route('/project-issues/:projectIssueId/header')
		.put(users.requiresLogin, projectIssues.hasAuthorization, projectIssues.updateHeader);

	// Status
	app.route('/project-issues/:projectIssueId/status')
		.put(users.requiresLogin, projectIssues.hasAuthorization, projectIssues.updateStatus);


	// Finish by binding the Project issue middleware
	app.param('projectIssueId', projectIssues.projectIssueByID);
};
