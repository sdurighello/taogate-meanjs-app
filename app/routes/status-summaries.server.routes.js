'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var statusSummaries = require('../../app/controllers/status-summaries.server.controller');

    app.route('/status-summaries/portfolioSummary')
        .get(users.requiresLogin, statusSummaries.hasAuthorization, statusSummaries.portfolioSummary);

};
