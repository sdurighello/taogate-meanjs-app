'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var priorityAssignment = require('../../app/controllers/priority-assignment.server.controller');

    app.route('/priority-assignment/prioritizationOverview')
        .get(users.requiresLogin, priorityAssignment.hasAuthorization, priorityAssignment.prioritizationOverview);


};
