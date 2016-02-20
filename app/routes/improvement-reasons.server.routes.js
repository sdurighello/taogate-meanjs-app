'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var improvementReasons = require('../../app/controllers/improvement-reasons.server.controller');

	// Improvement reasons Routes
	app.route('/improvement-reasons')
		.get(users.requiresLogin, improvementReasons.list)
		.post(users.requiresLogin, improvementReasons.hasAuthorization, improvementReasons.create);

	app.route('/improvement-reasons/:improvementReasonId')
		.get(users.requiresLogin, improvementReasons.read)
		.put(users.requiresLogin, improvementReasons.hasAuthorization, improvementReasons.update)
		.delete(users.requiresLogin, improvementReasons.hasAuthorization, improvementReasons.delete);

	// Finish by binding the Improvement reason middleware
	app.param('improvementReasonId', improvementReasons.improvementReasonByID);
};
