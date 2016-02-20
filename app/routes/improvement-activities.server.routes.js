'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var improvementActivities = require('../../app/controllers/improvement-activities.server.controller');

	// Improvement activities Routes
	app.route('/improvement-activities')
		.get(users.requiresLogin, improvementActivities.list)
		.post(users.requiresLogin, improvementActivities.hasAuthorization, improvementActivities.create);

	app.route('/improvement-activities/:improvementActivityId')
		.get(users.requiresLogin, improvementActivities.read)
		.put(users.requiresLogin, improvementActivities.hasAuthorization, improvementActivities.update)
		.delete(users.requiresLogin, improvementActivities.hasAuthorization, improvementActivities.delete);

	// Header
	app.route('/improvement-activities/:improvementActivityId/header')
		.put(users.requiresLogin, improvementActivities.hasAuthorization, improvementActivities.updateHeader);

	// Status
	app.route('/improvement-activities/:improvementActivityId/status')
		.put(users.requiresLogin, improvementActivities.hasAuthorization, improvementActivities.updateStatus);

	// Finish by binding the Improvement activity middleware
	app.param('improvementActivityId', improvementActivities.improvementActivityByID);
};
