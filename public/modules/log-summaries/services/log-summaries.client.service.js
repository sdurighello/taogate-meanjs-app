'use strict';

//Log summaries service used to communicate Log summaries REST endpoints
angular.module('log-summaries').factory('LogSummaries', ['$resource',
	function($resource) {
		return $resource('log-summaries', { 
		}, {
            portfolioLogsSummary: {
                method: 'GET',
                isArray: false,
                url: 'log-summaries/portfolioLogs'
            }
		});
	}
]);
