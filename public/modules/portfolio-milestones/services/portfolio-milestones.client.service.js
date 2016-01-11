'use strict';

//Portfolio milestones service used to communicate Portfolio milestones REST endpoints
angular.module('portfolio-milestones').factory('PortfolioMilestones', ['$resource',
	function($resource) {
		return $resource('portfolio-milestones/:portfolioMilestoneId', { portfolioMilestoneId: '@_id'
		}, {

// ********************* PORTFOLIO MILESTONES **********************

			update: {
				method: 'PUT'
			},

			// --- Header --
			updateHeader: {
				method: 'PUT',
				url: 'portfolio-milestones/:portfolioMilestoneId/header'
				// req.body: {whole portfolioChangeRequest object}
			},

			// --- Status --
			updateStatus: {
				method: 'PUT',
				url: 'portfolio-milestones/:portfolioMilestoneId/status'
				// req.body: {whole portfolioChangeRequest object}
			},

// **************** ASSOCIATED PROJECT MILESTONES ******************

			// --- Get available project milestones --
			getAvailableProjectMilestones: {
				method: 'GET',
				isArray: true,
				url: 'portfolio-milestones/:portfolioMilestoneId/portfolios/:portfolioId'
				// req.query: { }
				// Returns: [{projectMilestone}]
			},

			// --- Add associated project milestone --
			addProjectMilestone: {
				method: 'PUT',
				url: 'portfolio-milestones/:portfolioMilestoneId/project-milestones/:projectMilestoneId/addProjectMilestone'
				// req.body: {portfolio milestone object}
			},

			// --- Remove associated project milestone --
			removeProjectMilestone: {
				method: 'PUT',
				url: 'portfolio-milestones/:portfolioMilestoneId/project-milestones/:projectMilestoneId/removeProjectMilestone'
				// req.body: {portfolio milestone object}
			}
		});
	}
]);
