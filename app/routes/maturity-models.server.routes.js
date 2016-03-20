'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var maturityModels = require('../../app/controllers/maturity-models.server.controller');

	// Maturity models Routes

	app.route('/maturity-models')
		.get(users.requiresLogin, maturityModels.list)
		.post(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.create);

	app.route('/maturity-models/:maturityModelId')
		.get(users.requiresLogin, maturityModels.read)
		.put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.update)
		.delete(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.delete);

	// Levels

    app.route('/maturity-models/:maturityModelId/createLevel')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.createLevel);

    app.route('/maturity-models/:maturityModelId/sortLevels')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.sortLevels);

    app.route('/maturity-models/:maturityModelId/updateLevel/:levelId')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.updateLevel);

    app.route('/maturity-models/:maturityModelId/deleteLevel/:levelId')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.deleteLevel);


    // Domains

    app.route('/maturity-models/:maturityModelId/createDomain')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.createDomain);

    app.route('/maturity-models/:maturityModelId/updateDomain/:domainId')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.updateDomain);

    app.route('/maturity-models/:maturityModelId/deleteDomain/:domainId')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.deleteDomain);



    // Finish by binding the Maturity model middleware
	app.param('maturityModelId', maturityModels.maturityModelByID);
};
