'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var priorityAssignment = require('../../app/controllers/priority-assignment.server.controller');

    app.route('/priority-assignment/prioritizationOverviewPortfolio')
        .get(users.requiresLogin, priorityAssignment.prioritizationOverviewPortfolio);

    app.route('/priority-assignment/prioritizationOverviewStrategy')
        .get(users.requiresLogin, priorityAssignment.prioritizationOverviewStrategy);


};
