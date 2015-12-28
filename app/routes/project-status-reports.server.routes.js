'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectStatusReports = require('../../app/controllers/project-status-reports.server.controller');

	// Project status reports Routes
	app.route('/project-status-reports')
		.get(users.requiresLogin, projectStatusReports.list)
		.post(users.requiresLogin, projectStatusReports.hasAuthorization, projectStatusReports.create);

	app.route('/project-status-reports/:projectStatusReportId')
		.get(users.requiresLogin, projectStatusReports.read)
		.put(users.requiresLogin, projectStatusReports.hasAuthorization, projectStatusReports.update)
		.delete(users.requiresLogin, projectStatusReports.hasAuthorization, projectStatusReports.delete);

	// Finish by binding the Project status report middleware
	app.param('projectStatusReportId', projectStatusReports.projectStatusReportByID);
};
