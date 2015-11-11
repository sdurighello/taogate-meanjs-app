'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var changeRequests = require('../../app/controllers/change-requests.server.controller');

	// Change requests Routes
	app.route('/change-requests')
		.get(users.requiresLogin, changeRequests.list)
		.post(users.requiresLogin, changeRequests.hasAuthorization, changeRequests.create);

	app.route('/change-requests/:changeRequestId')
		.get(users.requiresLogin, changeRequests.read)
		.put(users.requiresLogin, changeRequests.hasAuthorization, changeRequests.update)
		.delete(users.requiresLogin, changeRequests.hasAuthorization, changeRequests.delete);

	// Finish by binding the Change request middleware
	app.param('changeRequestId', changeRequests.changeRequestByID);
};
