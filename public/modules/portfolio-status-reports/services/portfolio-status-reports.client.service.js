'use strict';

//Portfolio status reports service used to communicate Portfolio status reports REST endpoints
angular.module('portfolio-status-reports').factory('PortfolioStatusReports', ['$resource',
	function($resource) {
		return $resource('portfolio-status-reports/:portfolioStatusReportId', { portfolioStatusReportId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            updateHeader: {
                method: 'PUT',
                url: 'portfolio-status-reports/:portfolioStatusReportId/header'
            },

            updateOverallStatus: {
                method: 'PUT',
                url: 'portfolio-status-reports/:portfolioStatusReportId/overallStatus'
            },

            updateStatusArea: {
                method: 'PUT',
                url: 'portfolio-status-reports/:portfolioStatusReportId/portfolioStatusAreas/:portfolioStatusAreaId'
            }
            
		});
	}
]);
