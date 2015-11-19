'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioRankings = require('../../app/controllers/portfolio-rankings.server.controller');

	// Portfolio rankings Routes
	app.route('/portfolio-rankings')
		.get(users.requiresLogin, portfolioRankings.list)
		.post(users.requiresLogin, portfolioRankings.hasAuthorization, portfolioRankings.create);

	app.route('/portfolio-rankings/:portfolioRankingId')
		.get(users.requiresLogin, portfolioRankings.read)
		.put(users.requiresLogin, portfolioRankings.hasAuthorization, portfolioRankings.update)
		.delete(users.requiresLogin, portfolioRankings.hasAuthorization, portfolioRankings.delete);

	// Finish by binding the Portfolio ranking middleware
	app.param('portfolioRankingId', portfolioRankings.portfolioRankingByID);
};
