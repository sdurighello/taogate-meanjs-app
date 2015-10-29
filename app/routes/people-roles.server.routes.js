'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var peopleRoles = require('../../app/controllers/people-roles.server.controller');

	// People roles Routes
	app.route('/people-roles')
		.get(users.requiresLogin, peopleRoles.list)
		.post(users.requiresLogin, peopleRoles.hasAuthorization, peopleRoles.create);

	app.route('/people-roles/:peopleRoleId')
		.get(users.requiresLogin, peopleRoles.read)
		.put(users.requiresLogin, peopleRoles.hasAuthorization, peopleRoles.update)
		.delete(users.requiresLogin, peopleRoles.hasAuthorization, peopleRoles.delete);

	// Finish by binding the People role middleware
	app.param('peopleRoleId', peopleRoles.peopleRoleByID);
};
