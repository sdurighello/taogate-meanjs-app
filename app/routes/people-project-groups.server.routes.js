'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var peopleProjectGroups = require('../../app/controllers/people-project-groups.server.controller');

	// People project groups Routes
	app.route('/people-project-groups')
		.get(users.requiresLogin, peopleProjectGroups.list)
		.post(users.requiresLogin, peopleProjectGroups.hasAuthorization, peopleProjectGroups.create);

	app.route('/people-project-groups/:peopleProjectGroupId')
		.get(users.requiresLogin, peopleProjectGroups.read)
		.put(users.requiresLogin, peopleProjectGroups.hasAuthorization, peopleProjectGroups.update)
		.delete(users.requiresLogin, peopleProjectGroups.hasAuthorization, peopleProjectGroups.delete);

	// Finish by binding the People project group middleware
	app.param('peopleProjectGroupId', peopleProjectGroups.peopleProjectGroupByID);
};
