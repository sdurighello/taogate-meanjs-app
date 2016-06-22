'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var statusReportTypes = require('../../app/controllers/status-report-types.server.controller');

	// Status report types Routes
	app.route('/status-report-types')
		.get(users.requiresLogin, statusReportTypes.list)
		.post(users.requiresLogin, statusReportTypes.hasAuthorization, statusReportTypes.create);

	app.route('/status-report-types/:statusReportTypeId')
		.get(users.requiresLogin, statusReportTypes.read)
		.put(users.requiresLogin, statusReportTypes.hasAuthorization, statusReportTypes.update)
		.delete(users.requiresLogin, statusReportTypes.hasAuthorization, statusReportTypes.delete);

	// Finish by binding the Status report type middleware
	app.param('statusReportTypeId', statusReportTypes.statusReportTypeByID);
};
