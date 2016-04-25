'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var categoryAssignment = require('../../app/controllers/category-assignment.server.controller');

    app.route('/category-assignment/categorizationOverviewPortfolio')
        .get(users.requiresLogin, categoryAssignment.hasAuthorization, categoryAssignment.categorizationOverviewPortfolio);

    app.route('/category-assignment/categorizationOverviewStrategy')
        .get(users.requiresLogin, categoryAssignment.hasAuthorization, categoryAssignment.categorizationOverviewStrategy);


};
