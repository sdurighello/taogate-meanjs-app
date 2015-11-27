'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var peoplePortfolioRoles = require('../../app/controllers/people-portfolio-roles.server.controller');

	// People portfolio roles Routes
	app.route('/people-portfolio-roles')
		.get(users.requiresLogin, peoplePortfolioRoles.list)
		.post(users.requiresLogin, peoplePortfolioRoles.hasAuthorization, peoplePortfolioRoles.create);

	app.route('/people-portfolio-roles/:peoplePortfolioRoleId')
		.get(users.requiresLogin, peoplePortfolioRoles.read)
		.put(users.requiresLogin, peoplePortfolioRoles.hasAuthorization, peoplePortfolioRoles.update)
		.delete(users.requiresLogin, peoplePortfolioRoles.hasAuthorization, peoplePortfolioRoles.delete);

	// Finish by binding the People portfolio role middleware
	app.param('peoplePortfolioRoleId', peoplePortfolioRoles.peoplePortfolioRoleByID);
};
