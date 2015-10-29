'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var subusers = require('../../app/controllers/subusers.server.controller');

	// Subusers Routes
	app.route('/subusers')
		.get(subusers.list)
		.post(users.requiresLogin, subusers.create);

	app.route('/subusers/:subuserId')
		.get(subusers.read)
		.put(users.requiresLogin, subusers.hasAuthorization, subusers.update)
		.delete(users.requiresLogin, subusers.hasAuthorization, subusers.delete);

	// Finish by binding the Subuser middleware
	app.param('subuserId', subusers.subuserByID);
};
