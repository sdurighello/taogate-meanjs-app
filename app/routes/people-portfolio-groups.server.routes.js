'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var peoplePortfolioGroups = require('../../app/controllers/people-portfolio-groups.server.controller');

	// People portfolio groups Routes
	app.route('/people-portfolio-groups')
		.get(users.requiresLogin, peoplePortfolioGroups.list)
		.post(users.requiresLogin, peoplePortfolioGroups.hasAuthorization, peoplePortfolioGroups.create);

	app.route('/people-portfolio-groups/:peoplePortfolioGroupId')
		.get(users.requiresLogin, peoplePortfolioGroups.read)
		.put(users.requiresLogin, peoplePortfolioGroups.hasAuthorization, peoplePortfolioGroups.update)
		.delete(users.requiresLogin, peoplePortfolioGroups.hasAuthorization, peoplePortfolioGroups.delete);

	// Finish by binding the People portfolio group middleware
	app.param('peoplePortfolioGroupId', peoplePortfolioGroups.peoplePortfolioGroupByID);
};
