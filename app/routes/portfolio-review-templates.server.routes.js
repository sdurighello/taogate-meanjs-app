'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var portfolioReviewTemplates = require('../../app/controllers/portfolio-review-templates.server.controller');

	// Portfolio review templates Routes
	app.route('/portfolio-review-templates')
		.get(users.requiresLogin, portfolioReviewTemplates.list)
		.post(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.create);

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId')
		.get(users.requiresLogin, portfolioReviewTemplates.read)
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.update)
		.delete(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.delete);


	// -- Review Group --

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId/groups')
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.createGroup);

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/update')
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.updateGroup);

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/delete')
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.deleteGroup);

	// -- Add/Remove Stakeholder Groups --

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/add')
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.addPeopleGroup);

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/peopleGroups/:peopleGroupId/remove')
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.removePeopleGroup);

	// -- Review Item --

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/items')
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.createItem);

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/items/:itemId/update')
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.updateItem);

	app.route('/portfolio-review-templates/:portfolioReviewTemplateId/groups/:groupId/items/:itemId/delete')
		.put(users.requiresLogin, portfolioReviewTemplates.hasAuthorization, portfolioReviewTemplates.deleteItem);


	// Finish by binding the Portfolio review template middleware
	app.param('portfolioReviewTemplateId', portfolioReviewTemplates.portfolioReviewTemplateByID);
};
