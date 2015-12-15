'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var processAssignments = require('../../app/controllers/process-assignments.server.controller');

	// Process assignments Routes
	app.route('/process-assignments')
		.get(users.requiresLogin, processAssignments.list)
		.post(users.requiresLogin, processAssignments.hasAuthorization, processAssignments.create);

	app.route('/process-assignments/:processAssignmentId')
		.get(users.requiresLogin, processAssignments.read)
		.put(users.requiresLogin, processAssignments.hasAuthorization, processAssignments.update)
		.delete(users.requiresLogin, processAssignments.hasAuthorization, processAssignments.delete);

	app.route('/process-assignments/:processAssignmentId/updateProcess')
		.put(users.requiresLogin, processAssignments.hasAuthorization, processAssignments.updateProcess);

    app.route('/process-assignments/findOneByProjectId/:projectId')
        .get(users.requiresLogin, processAssignments.findOneByProjectId);

	// Finish by binding the Process assignment middleware
	app.param('processAssignmentId', processAssignments.processAssignmentByID);
};
