'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var milestoneTypes = require('../../app/controllers/milestone-types.server.controller');

	// Milestone types Routes
	app.route('/milestone-types')
		.get(milestoneTypes.list)
		.post(users.requiresLogin, milestoneTypes.create);

	app.route('/milestone-types/:milestoneTypeId')
		.get(milestoneTypes.read)
		.put(users.requiresLogin, milestoneTypes.hasAuthorization, milestoneTypes.update)
		.delete(users.requiresLogin, milestoneTypes.hasAuthorization, milestoneTypes.delete);

	// Finish by binding the Milestone type middleware
	app.param('milestoneTypeId', milestoneTypes.milestoneTypeByID);
};
