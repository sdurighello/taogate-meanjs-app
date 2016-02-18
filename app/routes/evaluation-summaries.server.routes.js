'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var evaluationSummaries = require('../../app/controllers/evaluation-summaries.server.controller');

	app.route('/evaluation-summaries/portfolioSummary')
		.get(users.requiresLogin, evaluationSummaries.hasAuthorization, evaluationSummaries.portfolioSummary);

};
