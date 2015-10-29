'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var strategyNodes = require('../../app/controllers/strategy-nodes.server.controller');

	// Strategy nodes Routes
	app.route('/strategy-nodes')
		.get(users.requiresLogin, strategyNodes.list)
		.post(users.requiresLogin, strategyNodes.hasAuthorization, strategyNodes.create);

	app.route('/strategy-nodes/:strategyNodeId')
		.get(users.requiresLogin, strategyNodes.read)
		.put(users.requiresLogin, strategyNodes.hasAuthorization, strategyNodes.update)
		.delete(users.requiresLogin, strategyNodes.hasAuthorization, strategyNodes.delete);

	// Finish by binding the Strategy node middleware
	app.param('strategyNodeId', strategyNodes.strategyNodeByID);
};
