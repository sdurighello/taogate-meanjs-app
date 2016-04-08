'use strict';

module.exports = function(app) {
    var users = require('../../app/controllers/users.server.controller');
    var mytao = require('../../app/controllers/mytao.server.controller');

    app.route('/mytao/user-projects').get(users.requiresLogin, mytao.getUserProjects);

    app.route('/mytao/user-portfolios').get(users.requiresLogin, mytao.getUserPortfolios);
    
};
