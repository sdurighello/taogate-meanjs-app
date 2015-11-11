'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var changeRequestStates = require('../../app/controllers/change-request-states.server.controller');

	// Change request states Routes
	app.route('/change-request-states')
		.get(users.requiresLogin, changeRequestStates.list)
		.post(users.requiresLogin, changeRequestStates.hasAuthorization, changeRequestStates.create);

	app.route('/change-request-states/:changeRequestStateId')
		.get(users.requiresLogin, changeRequestStates.read)
		.put(users.requiresLogin, changeRequestStates.hasAuthorization, changeRequestStates.update)
		.delete(users.requiresLogin, changeRequestStates.hasAuthorization, changeRequestStates.delete);

	// Finish by binding the Change request state middleware
	app.param('changeRequestStateId', changeRequestStates.changeRequestStateByID);
};
