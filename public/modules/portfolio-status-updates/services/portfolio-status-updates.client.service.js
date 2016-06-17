'use strict';

//Portfolio status updates service used to communicate Portfolio status updates REST endpoints
angular.module('portfolio-status-updates').factory('PortfolioStatusUpdates', ['$resource',
	function($resource) {
		return $resource('portfolio-status-updates/:portfolioStatusUpdateId', { portfolioStatusUpdateId: '@_id'
		}, {

            // --- Header ---

            updateHeader: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/header'
            },

            // --- Overall Delivery Status ---

            updateOverallDeliveryStatus: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/overallDeliveryStatus'
            },

            // --- Log status area

            updateStatusAreaReview: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/status-area-reviews/:statusAreaReviewId'
            },

            // --- Approval --

            submit: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/submit'
            },

            approve: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/approve'
            },

            reject: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/reject'
            },

            draft: {
                method: 'PUT',
                url: 'portfolio-status-updates/:portfolioStatusUpdateId/draft'
            }
		});
	}
]);
