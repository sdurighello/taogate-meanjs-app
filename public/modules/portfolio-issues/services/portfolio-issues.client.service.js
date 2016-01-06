'use strict';

//Portfolio issues service used to communicate Portfolio issues REST endpoints
angular.module('portfolio-issues').factory('PortfolioIssues', ['$resource',
	function($resource) {
		return $resource('portfolio-issues/:portfolioIssueId', { portfolioIssueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

			// --- Header --
			updateHeader: {
				method: 'PUT',
				url: 'portfolio-issues/:portfolioIssueId/header'
				// req.body: {whole issue object}
			},

			// --- Status --
			updateStatus: {
				method: 'PUT',
				url: 'portfolio-issues/:portfolioIssueId/status'
				// req.body: {whole issue object}
			},

            // --- Status --
            createAction: {
                method: 'POST',
                url: 'portfolio-issues/:portfolioIssueId/createAction'
                // req.body: {the new action object}
            }
		});
	}
]);
