'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioMilestoneTypes = require('../../app/controllers/portfolio-milestone-types.server.controller');

	// Portfolio milestone types Routes
	app.route('/portfolio-milestone-types')
		.get(users.requiresLogin, portfolioMilestoneTypes.list)
		.post(users.requiresLogin, portfolioMilestoneTypes.hasAuthorization, portfolioMilestoneTypes.create);

	app.route('/portfolio-milestone-types/:portfolioMilestoneTypeId')
		.get(users.requiresLogin, portfolioMilestoneTypes.read)
		.put(users.requiresLogin, portfolioMilestoneTypes.hasAuthorization, portfolioMilestoneTypes.update)
		.delete(users.requiresLogin, portfolioMilestoneTypes.hasAuthorization, portfolioMilestoneTypes.delete);

	// Finish by binding the Portfolio milestone type middleware
	app.param('portfolioMilestoneTypeId', portfolioMilestoneTypes.portfolioMilestoneTypeByID);
};
