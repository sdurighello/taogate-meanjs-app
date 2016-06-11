'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioStatusReports = require('../../app/controllers/portfolio-status-reports.server.controller');

	// Portfolio status reports Routes
	app.route('/portfolio-status-reports')
		.get(users.requiresLogin, portfolioStatusReports.list)
		.post(users.requiresLogin, portfolioStatusReports.hasAuthorization, portfolioStatusReports.create);

	app.route('/portfolio-status-reports/:portfolioStatusReportId')
		.get(users.requiresLogin, portfolioStatusReports.read)
		.put(users.requiresLogin, portfolioStatusReports.hasAuthorization, portfolioStatusReports.update)
		.delete(users.requiresLogin, portfolioStatusReports.hasAuthorization, portfolioStatusReports.delete);

	// Finish by binding the Portfolio status report middleware
	app.param('portfolioStatusReportId', portfolioStatusReports.portfolioStatusReportByID);
};
