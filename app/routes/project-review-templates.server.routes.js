'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projectReviewTemplates = require('../../app/controllers/project-review-templates.server.controller');

	// Project review templates Routes
	app.route('/project-review-templates')
		.get(users.requiresLogin, projectReviewTemplates.list)
		.post(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.create);

	app.route('/project-review-templates/:projectReviewTemplateId')
		.get(users.requiresLogin, projectReviewTemplates.read)
		.put(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.update)
		.delete(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.delete);

    // -- Review Group --

    app.route('/project-review-templates/:projectReviewTemplateId/groups')
        .put(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.createGroup);

    app.route('/project-review-templates/:projectReviewTemplateId/groups/:groupId/update')
        .put(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.updateGroup);

    app.route('/project-review-templates/:projectReviewTemplateId/groups/:groupId/delete')
        .put(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.deleteGroup);

    // -- Add/Remove Stakeholder Groups --

    app.route('/project-review-templates/:projectReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/add')
        .put(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.addPeopleGroup);

    app.route('/project-review-templates/:projectReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/remove')
        .put(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.removePeopleGroup);

    // -- Review Item --

    app.route('/project-review-templates/:projectReviewTemplateId/groups/:groupId/items')
        .put(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.createItem);

    app.route('/project-review-templates/:projectReviewTemplateId/groups/:groupId/items/:itemId/update')
        .put(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.updateItem);

    app.route('/project-review-templates/:projectReviewTemplateId/groups/:groupId/items/:itemId/delete')
        .put(users.requiresLogin, projectReviewTemplates.hasAuthorization, projectReviewTemplates.deleteItem);


	// Finish by binding the Project review template middleware
	app.param('projectReviewTemplateId', projectReviewTemplates.projectReviewTemplateByID);
};
