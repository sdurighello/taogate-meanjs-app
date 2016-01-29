'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var deliveryDashboards = require('../../app/controllers/delivery-dashboards.server.controller');

	// Definition dashboards Routes
	app.route('/delivery-dashboards/gatePerformances/:projectId')
		.get(users.requiresLogin, deliveryDashboards.hasAuthorization, deliveryDashboards.gatePerformances);

};
