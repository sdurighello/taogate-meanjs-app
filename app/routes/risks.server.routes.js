'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var risks = require('../../app/controllers/risks.server.controller');

	// Risks Routes
	app.route('/risks')
		.get(risks.list)
		.post(users.requiresLogin, risks.create);

	app.route('/risks/:riskId')
		.get(risks.read)
		.put(users.requiresLogin, risks.hasAuthorization, risks.update)
		.delete(users.requiresLogin, risks.hasAuthorization, risks.delete);

	// Finish by binding the Risk middleware
	app.param('riskId', risks.riskByID);
};
