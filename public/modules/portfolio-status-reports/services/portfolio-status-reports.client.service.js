'use strict';

//Portfolio status reports service used to communicate Portfolio status reports REST endpoints
angular.module('portfolio-status-reports').factory('PortfolioStatusReports', ['$resource',
	function($resource) {
		return $resource('portfolio-status-reports/:portfolioStatusReportId', { portfolioStatusReportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);