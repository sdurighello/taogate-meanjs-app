'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var overallRankings = require('../../app/controllers/overall-rankings.server.controller');

	// Overall rankings Routes
	app.route('/overall-rankings')
		.get(users.requiresLogin, overallRankings.list)
		.post(users.requiresLogin, overallRankings.hasAuthorization, overallRankings.create);

	app.route('/overall-rankings/:overallRankingId')
		.get(users.requiresLogin, overallRankings.read)
		.put(users.requiresLogin, overallRankings.hasAuthorization, overallRankings.update)
		.delete(users.requiresLogin, overallRankings.hasAuthorization, overallRankings.delete);

	// Finish by binding the Overall ranking middleware
	app.param('overallRankingId', overallRankings.overallRankingByID);
};
