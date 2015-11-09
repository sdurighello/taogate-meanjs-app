'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gateOutcomeScores = require('../../app/controllers/gate-outcome-scores.server.controller');

	// Gate outcome scores Routes
	app.route('/gate-outcome-scores')
		.get(users.requiresLogin, gateOutcomeScores.list)
		.post(users.requiresLogin, gateOutcomeScores.hasAuthorization, gateOutcomeScores.create);

	app.route('/gate-outcome-scores/:gateOutcomeScoreId')
		.get(gateOutcomeScores.read)
		.put(users.requiresLogin, gateOutcomeScores.hasAuthorization, gateOutcomeScores.update)
		.delete(users.requiresLogin, gateOutcomeScores.hasAuthorization, gateOutcomeScores.delete);

	// Finish by binding the Gate outcome score middleware
	app.param('gateOutcomeScoreId', gateOutcomeScores.gateOutcomeScoreByID);
};
