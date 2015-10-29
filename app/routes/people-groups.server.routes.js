'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var peopleGroups = require('../../app/controllers/people-groups.server.controller');

	// People groups Routes
	app.route('/people-groups')
		.get(users.requiresLogin, peopleGroups.list)
		.post(users.requiresLogin, peopleGroups.hasAuthorization, peopleGroups.create);

	app.route('/people-groups/:peopleGroupId')
		.get(users.requiresLogin, peopleGroups.read)
		.put(users.requiresLogin, peopleGroups.hasAuthorization, peopleGroups.update)
		.delete(users.requiresLogin, peopleGroups.hasAuthorization, peopleGroups.delete);

	// Finish by binding the People group middleware
	app.param('peopleGroupId', peopleGroups.peopleGroupByID);
};
