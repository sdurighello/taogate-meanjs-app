'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var definitionDashboards = require('../../app/controllers/definition-dashboards.server.controller');

	// Definition dashboards Routes
	app.route('/definition-dashboards')
		.get(definitionDashboards.list)
		.post(users.requiresLogin, definitionDashboards.create);

	app.route('/definition-dashboards/:definitionDashboardId')
		.get(definitionDashboards.read)
		.put(users.requiresLogin, definitionDashboards.hasAuthorization, definitionDashboards.update)
		.delete(users.requiresLogin, definitionDashboards.hasAuthorization, definitionDashboards.delete);

	// Finish by binding the Definition dashboard middleware
	app.param('definitionDashboardId', definitionDashboards.definitionDashboardByID);
};
