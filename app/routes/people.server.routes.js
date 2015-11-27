'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var people = require('../../app/controllers/people.server.controller');

	// People Routes
	app.route('/people')
		.get(users.requiresLogin, people.list)
		.post(users.requiresLogin, people.hasAuthorization, people.create);

	app.route('/people/:personId')
		.get(users.requiresLogin, people.read)
		.put(users.requiresLogin, people.hasAuthorization, people.update)
		.delete(users.requiresLogin, people.hasAuthorization, people.delete);

	// Finish by binding the Person middleware
	app.param('personId', people.personByID);
};
