'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var roadmaps = require('../../app/controllers/roadmaps.server.controller');

    app.route('/roadmaps/definition')
        .get(users.requiresLogin, roadmaps.hasAuthorization, roadmaps.getDefinitionRoadmap);

};
