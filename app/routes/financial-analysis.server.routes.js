'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var financialAnalysis = require('../../app/controllers/financial-analysis.server.controller');

    // Evaluation dashboards Routes
    app.route('/financial-analysis/financialProfile/:projectId')
        .get(users.requiresLogin, financialAnalysis.hasAuthorization, financialAnalysis.financialProfile);

};
