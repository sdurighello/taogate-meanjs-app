'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var peopleProjectRoles = require('../../app/controllers/people-project-roles.server.controller');

	// People project roles Routes
	app.route('/people-project-roles')
		.get(users.requiresLogin, peopleProjectRoles.list)
		.post(users.requiresLogin, peopleProjectRoles.hasAuthorization, peopleProjectRoles.create);

	app.route('/people-project-roles/:peopleProjectRoleId')
		.get(users.requiresLogin, peopleProjectRoles.read)
		.put(users.requiresLogin, peopleProjectRoles.hasAuthorization, peopleProjectRoles.update)
		.delete(users.requiresLogin, peopleProjectRoles.hasAuthorization, peopleProjectRoles.delete);

	// Finish by binding the People project role middleware
	app.param('peopleProjectRoleId', peopleProjectRoles.peopleProjectRoleByID);
};
