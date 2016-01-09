'use strict';

//Portfolio change requests service used to communicate Portfolio change requests REST endpoints
angular.module('portfolio-change-requests').factory('PortfolioChangeRequests', ['$resource',
	function($resource) {
		return $resource('portfolio-change-requests/:portfolioChangeRequestId', { portfolioChangeRequestId: '@_id'
		}, {

// ********************* PORTFOLIO CHANGES **********************

			update: {
				method: 'PUT'
			},

			// --- Header --
			updateHeader: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/header'
				// req.body: {whole portfolioChangeRequest object}
			},

// **************** ASSOCIATED PROJECT CHANGES ******************

			// --- Get available project changes --
			getAvailableProjectChangeRequests: {
				method: 'GET',
				isArray: true,
				url: 'portfolio-change-requests/:portfolioChangeRequestId/portfolios/:portfolioId'
				// req.query: { }
				// Returns: [{projectChangeRequest}]
			},

			// --- Add associated project change --
			addProjectChangeRequest: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/project-change-requests/:projectChangeRequestId/addProjectChange'
				// req.body: {portfolio change object}
			},

			// --- Remove associated project change --
			removeProjectChangeRequest: {
				method: 'PUT',
				url: 'portfolio-change-requests/:portfolioChangeRequestId/project-change-requests/:projectChangeRequestId/removeProjectChange'
				// req.body: {portfolio change object}
			}

		});
	}
]);
