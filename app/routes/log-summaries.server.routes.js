'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var logSummaries = require('../../app/controllers/log-summaries.server.controller');
    
    app.route('/log-summaries/portfolioLogs')
        .get(users.requiresLogin, logSummaries.hasAuthorization, logSummaries.portfolioLogsSummary);
    
};
