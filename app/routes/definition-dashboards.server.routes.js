'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var definitionDashboards = require('../../app/controllers/definition-dashboards.server.controller');

	// Definition dashboards Routes
	app.route('/definition-dashboards/projectCategorization')
		.get(users.requiresLogin, definitionDashboards.hasAuthorization, definitionDashboards.projectCategorization);

	app.route('/definition-dashboards/projectPrioritization')
		.get(users.requiresLogin, definitionDashboards.hasAuthorization, definitionDashboards.projectPrioritization);

};
