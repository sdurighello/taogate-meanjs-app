'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var issueReasons = require('../../app/controllers/issue-reasons.server.controller');

	// Issue reasons Routes
	app.route('/issue-reasons')
		.get(issueReasons.list)
		.post(users.requiresLogin, issueReasons.create);

	app.route('/issue-reasons/:issueReasonId')
		.get(issueReasons.read)
		.put(users.requiresLogin, issueReasons.hasAuthorization, issueReasons.update)
		.delete(users.requiresLogin, issueReasons.hasAuthorization, issueReasons.delete);

	// Finish by binding the Issue reason middleware
	app.param('issueReasonId', issueReasons.issueReasonByID);
};
