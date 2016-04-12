'use strict';

//Setting up route
angular.module('portfolio-change-requests').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio change requests state routing
		$stateProvider.
		state('PortfolioChangeRequests', {
			url: '/portfolio-change-requests',
			templateUrl: 'modules/portfolio-change-requests/views/portfolio-change-requests.client.view.html'
		})
        .state('portfolio-change-requests-id', {
            url: '/portfolio-change-requests/:portfolioChangeRequestId/portfolios/:portfolioId',
            templateUrl: 'modules/portfolio-change-requests/views/portfolio-change-requests.client.view.html'
        });
	}
]);
