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


    // Areas

    app.route('/maturity-models/:maturityModelId/createArea')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.createArea);

    app.route('/maturity-models/:maturityModelId/updateArea/:areaId')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.updateArea);

    app.route('/maturity-models/:maturityModelId/deleteArea/:areaId')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.deleteArea);


    // Dimensions

    app.route('/maturity-models/:maturityModelId/createDimension')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.createDimension);

    app.route('/maturity-models/:maturityModelId/updateDimension/:dimensionId')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.updateDimension);

    app.route('/maturity-models/:maturityModelId/deleteDimension/:dimensionId')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.deleteDimension);

    app.route('/maturity-models/:maturityModelId/updateMaturityReview/:dimensionId')
        .put(users.requiresLogin, maturityModels.hasAuthorization, maturityModels.updateMaturityReview);



    // Finish by binding the Maturity model middleware
	app.param('maturityModelId', maturityModels.maturityModelByID);
};
