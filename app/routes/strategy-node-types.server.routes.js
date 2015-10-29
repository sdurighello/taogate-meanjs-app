'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var strategyNodeTypes = require('../../app/controllers/strategy-node-types.server.controller');

	// Strategy node types Routes
	app.route('/strategy-node-types')
		.get(users.requiresLogin, strategyNodeTypes.list)
		.post(users.requiresLogin, strategyNodeTypes.hasAuthorization, strategyNodeTypes.create);

	app.route('/strategy-node-types/:strategyNodeTypeId')
		.get(users.requiresLogin, strategyNodeTypes.read)
		.put(users.requiresLogin, strategyNodeTypes.hasAuthorization, strategyNodeTypes.update)
		.delete(users.requiresLogin, strategyNodeTypes.hasAuthorization, strategyNodeTypes.delete);

	// Finish by binding the Strategy node type middleware
	app.param('strategyNodeTypeId', strategyNodeTypes.strategyNodeTypeByID);
};
