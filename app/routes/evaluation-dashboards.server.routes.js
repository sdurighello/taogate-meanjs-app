'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var evaluationDashboards = require('../../app/controllers/evaluation-dashboards.server.controller');

	// Evaluation dashboards Routes
	app.route('/evaluation-dashboards/projectCategorization')
		.get(users.requiresLogin, evaluationDashboards.hasAuthorization, evaluationDashboards.projectCategorization);

	app.route('/evaluation-dashboards/projectPrioritization')
		.get(users.requiresLogin, evaluationDashboards.hasAuthorization, evaluationDashboards.projectPrioritization);
};
