'use strict';

//Project milestones service used to communicate Project milestones REST endpoints
angular.module('project-milestones').factory('ProjectMilestones', ['$resource',
	function($resource) {
		return $resource('project-milestones/:projectMilestoneId', { projectMilestoneId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Changes By Project --
			getMilestonesForProject: {
				method: 'GET',
				isArray: true,
				url: 'project-milestones-milestonesForProject'
				// req.query: { project: project._id }
				// Returns: [{gate: ... , projectMilestones: ... }]
			},

			// --- Header --

			updateHeader: {
				method: 'PUT',
				url: 'project-milestones/:projectMilestoneId/header'
				// req.body: {whole milestone object}
			},

			// --- Status --

			updateStatus: {
				method: 'PUT',
				url: 'project-milestones/:projectMilestoneId/status'
				// req.body: {whole milestone object}
			}
		});
	}
]);
