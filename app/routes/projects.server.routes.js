'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var projects = require('../../app/controllers/projects.server.controller');

	// Projects Routes
	app.route('/projects')
		.get(users.requiresLogin, projects.list)
		.post(users.requiresLogin, projects.hasAuthorization, projects.create);

	app.route('/projects/:projectId')
		.get(users.requiresLogin, projects.read)
		.put(users.requiresLogin, projects.hasAuthorization, projects.update)
		.delete(users.requiresLogin, projects.hasAuthorization, projects.delete);

	// Category & Priority assignment
	app.route('/projects/categoryAssignment/:projectId/:assignedGroupId/:assignedCategoryId/:valueId')
		.put(users.requiresLogin, projects.hasAuthorization, projects.updateCategoryAssignment);

    app.route('/projects/priorityAssignment/:projectId/:assignedGroupId/:assignedPriorityId/:valueId')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updatePriorityAssignment);

	// Cost assignment
	app.route('/projects/:projectId/costAssignment')
		.put(users.requiresLogin, projects.hasAuthorization, projects.createCostAssignment);

            // Deletion of assignment requires: req.query.deleteAssignedCost === 'true'
    app.route('/projects/:projectId/costAssignment/:costAssignmentId')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updateCostAssignment);

	// Benefit assignment
    app.route('/projects/:projectId/benefitAssignment')
        .put(users.requiresLogin, projects.hasAuthorization, projects.createBenefitAssignment);

    app.route('/projects/:projectId/benefitAssignment/:benefitAssignmentId')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updateBenefitAssignment);

    // Discount data
    app.route('/projects/:projectId/discountData')
        .put(users.requiresLogin, projects.hasAuthorization, projects.updateDiscountData);

	// Finish by binding the Project middleware
	app.param('projectId', projects.projectByID);
};
