'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var mytao = require('../../app/controllers/mytao.server.controller');

    var seed = require('../controllers/seed-data/seed-data.server.controller.js');

    app.route('/mytao/user-projects').get(users.requiresLogin, mytao.getUserProjects);

    app.route('/mytao/user-portfolios').get(users.requiresLogin, mytao.getUserPortfolios);

    app.route('/mytao/user-project-reviews').get(users.requiresLogin, mytao.getUserProjectReviews);

    app.route('/mytao/user-portfolio-reviews').get(users.requiresLogin, mytao.getUserPortfolioReviews);

    app.route('/mytao/user-improvement-activities').get(users.requiresLogin, mytao.getUserImprovementActivities);

    app.route('/mytao/user-project-change-requests').get(users.requiresLogin, mytao.getUserProjectChangeRequests);

    app.route('/mytao/user-project-status-updates').get(users.requiresLogin, mytao.getUserProjectStatusUpdates);
    
    app.route('/mytao/user-portfolio-change-requests').get(users.requiresLogin, mytao.getUserPortfolioChangeRequests);

    app.route('/mytao/user-gate-reviews').get(users.requiresLogin, mytao.getUserGateReviews);


    app.route('/mytao/seed').post(users.requiresLogin, seed.seed);


};
