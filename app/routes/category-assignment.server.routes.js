'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var categoryAssignment = require('../../app/controllers/category-assignment.server.controller');

    app.route('/category-assignment/categorizationOverview')
        .get(users.requiresLogin, categoryAssignment.categorizationOverview);


};
