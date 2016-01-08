'use strict';

//Portfolio issues service used to communicate Portfolio issues REST endpoints
angular.module('portfolio-issues').factory('PortfolioIssues', ['$resource',
	function($resource) {
		return $resource('portfolio-issues/:portfolioIssueId', { portfolioIssueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
// **************** ISSUE ******************

			// --- Issue Header --
			updateHeader: {
				method: 'PUT',
				url: 'portfolio-issues/:portfolioIssueId/header'
				// req.body: {whole issue object}
			},

			// --- Issue Status --
			updateStatus: {
				method: 'PUT',
				url: 'portfolio-issues/:portfolioIssueId/status'
				// req.body: {whole issue object}
			},

// **************** ACTION ******************

            // --- Create action --
            createAction: {
                method: 'POST',
                url: 'portfolio-issues/:portfolioIssueId/createAction'
                // req.body: {the new action object}
            },

            // --- Action Header --
            updateActionHeader: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/escalationActions/:escalationActionId/actionHeader'
                // req.body: {action object}
            },

            // --- Action Status --
            updateActionStatus: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/escalationActions/:escalationActionId/actionStatus'
                // req.body: {action object}
            },

            // --- Delete action --
            deleteAction: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/escalationActions/:escalationActionId/deleteAction'
                // req.body: {action object}
            },

// **************** ASSOCIATED PROJECT ISSUES ******************

            // --- Get available project issues for associatedProjectIssues --
            getAvailableProjectIssues: {
                method: 'GET',
                isArray: true,
                url: 'portfolio-issues/:portfolioIssueId/portfolios/:portfolioId'
                // req.query: { }
                // Returns: [{projectIssue}]
            },

            // --- Add associated project issue --
            addProjectIssue: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/project-issues/:projectIssueId/addProjectIssue'
                // req.body: {portfolio issue object}
            },

            // --- Remove associated project issue --
            removeProjectIssue: {
                method: 'PUT',
                url: 'portfolio-issues/:portfolioIssueId/project-issues/:projectIssueId/removeProjectIssue'
                // req.body: {portfolio issue object}
            }
		});
	}
]);
