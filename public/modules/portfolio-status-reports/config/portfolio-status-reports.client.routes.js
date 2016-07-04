'use strict';

//Setting up route
angular.module('portfolio-status-reports').config(['$stateProvider',
	function($stateProvider) {
		// Portfolio status reports state routing
		$stateProvider.
        state('listPortfolioStatusReports', {
            url: '/portfolio-status-reports',
            templateUrl: 'modules/portfolio-status-reports/views/list-portfolio-status-reports.client.view.html'
        }).
        state('listPortfolioStatusReportsWithPortfolioId', {
            url: '/portfolio-status-reports/list/:portfolioId',
            templateUrl: 'modules/portfolio-status-reports/views/list-portfolio-status-reports.client.view.html'
        }).
        state('createPortfolioStatusReport', {
            url: '/portfolio-status-reports/create',
            templateUrl: 'modules/portfolio-status-reports/views/create-portfolio-status-report.client.view.html'
        }).
        state('editPortfolioStatusReport', {
            url: '/portfolio-status-reports/document/:portfolioStatusReportId/list/:portfolioId',
            templateUrl: 'modules/portfolio-status-reports/views/edit-portfolio-status-report.client.view.html'
        });
	}
]);
