'use strict';

//Setting up route
angular.module('log-summaries').config(['$stateProvider',
	function($stateProvider) {
		// Log summaries state routing
		$stateProvider.
		state('portfolioLogSummaries', {
			url: '/log-summaries/portfolioLogs',
			templateUrl: 'modules/log-summaries/views/portfolio-logs-summary.client.view.html'
		});
	}
]);
