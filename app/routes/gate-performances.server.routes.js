'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gatePerformances = require('../../app/controllers/gate-performances.server.controller');

	// Definition dashboards Routes
	app.route('/gate-performances/projectPerformances/:projectId')
		.get(users.requiresLogin, gatePerformances.hasAuthorization, gatePerformances.projectPerformances);

	// Definition dashboards Routes
	app.route('/gate-performances/portfolioPerformances')
		.get(users.requiresLogin, gatePerformances.hasAuthorization, gatePerformances.portfolioPerformances);

};
