'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var qualitativeImpactGroups = require('../../app/controllers/qualitative-impact-groups.server.controller');

	// Qualitative impact groups Routes
	app.route('/qualitative-impact-groups')
		.get(users.requiresLogin, qualitativeImpactGroups.list)
		.post(users.requiresLogin, qualitativeImpactGroups.hasAuthorization, qualitativeImpactGroups.create);

	app.route('/qualitative-impact-groups/:qualitativeImpactGroupId')
		.get(users.requiresLogin, qualitativeImpactGroups.read)
		.put(users.requiresLogin, qualitativeImpactGroups.hasAuthorization, qualitativeImpactGroups.update)
		.delete(users.requiresLogin, qualitativeImpactGroups.hasAuthorization, qualitativeImpactGroups.delete);

	// Finish by binding the Qualitative impact group middleware
	app.param('qualitativeImpactGroupId', qualitativeImpactGroups.qualitativeImpactGroupByID);
};
