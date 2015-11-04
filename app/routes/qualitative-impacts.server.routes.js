'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var qualitativeImpacts = require('../../app/controllers/qualitative-impacts.server.controller');

	// Qualitative impacts Routes
	app.route('/qualitative-impacts')
		.get(users.requiresLogin, qualitativeImpacts.list)
		.post(users.requiresLogin, qualitativeImpacts.hasAuthorization, qualitativeImpacts.create);

	app.route('/qualitative-impacts/:qualitativeImpactId')
		.get(users.requiresLogin, qualitativeImpacts.read)
		.put(users.requiresLogin, qualitativeImpacts.hasAuthorization, qualitativeImpacts.update)
		.delete(users.requiresLogin, qualitativeImpacts.hasAuthorization, qualitativeImpacts.delete);

	// Finish by binding the Qualitative impact middleware
	app.param('qualitativeImpactId', qualitativeImpacts.qualitativeImpactByID);
};
