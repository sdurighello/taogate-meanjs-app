'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var evaluationDashboards = require('../../app/controllers/evaluation-dashboards.server.controller');

	// Evaluation dashboards Routes
	app.route('/evaluation-dashboards/financialProfile/:projectId')
		.get(users.requiresLogin, evaluationDashboards.hasAuthorization, evaluationDashboards.financialProfile);
};
