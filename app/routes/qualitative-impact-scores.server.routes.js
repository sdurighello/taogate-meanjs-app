'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var qualitativeImpactScores = require('../../app/controllers/qualitative-impact-scores.server.controller');

	// Qualitative impact scores Routes
	app.route('/qualitative-impact-scores')
		.get(users.requiresLogin, qualitativeImpactScores.list)
		.post(users.requiresLogin, qualitativeImpactScores.hasAuthorization, qualitativeImpactScores.create);

	app.route('/qualitative-impact-scores/:qualitativeImpactScoreId')
		.get(users.requiresLogin, qualitativeImpactScores.read)
		.put(users.requiresLogin, qualitativeImpactScores.hasAuthorization, qualitativeImpactScores.update)
		.delete(users.requiresLogin, qualitativeImpactScores.hasAuthorization, qualitativeImpactScores.delete);

	// Finish by binding the Qualitative impact score middleware
	app.param('qualitativeImpactScoreId', qualitativeImpactScores.qualitativeImpactScoreByID);
};
