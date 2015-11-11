'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var changeRequestReasons = require('../../app/controllers/change-request-reasons.server.controller');

	// Change request reasons Routes
	app.route('/change-request-reasons')
		.get(users.requiresLogin, changeRequestReasons.list)
		.post(users.requiresLogin, changeRequestReasons.hasAuthorization, changeRequestReasons.create);

	app.route('/change-request-reasons/:changeRequestReasonId')
		.get(users.requiresLogin, changeRequestReasons.read)
		.put(users.requiresLogin, changeRequestReasons.hasAuthorization, changeRequestReasons.update)
		.delete(users.requiresLogin, changeRequestReasons.hasAuthorization, changeRequestReasons.delete);

	// Finish by binding the Change request reason middleware
	app.param('changeRequestReasonId', changeRequestReasons.changeRequestReasonByID);
};
