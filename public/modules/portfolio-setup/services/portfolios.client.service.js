'use strict';

//Portfolios service used to communicate Portfolios REST endpoints
angular.module('portfolio-setup').factory('Portfolios', ['$resource',
	function($resource) {
		return $resource('portfolios/:portfolioId', { portfolioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            
			updatePeopleAssignment: {
				method: 'PUT',
				url: 'portfolios/:portfolioId/stakeholders/:assignedGroupId/:assignedRoleId'
				// req.body: {the whole "assignedRole" object}
			},

            // ----------------- PORTFOLIO STATUS UPDATES ---------------------

            createStatusUpdate: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/createStatusUpdate'
            },

            deleteStatusUpdate: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/delete'
            },

            // --- Header ---

            updateStatusUpdateHeader: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/header'
            },

            // --- Budget ---

            updateStatusUpdateBudget: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/budget'
            },

            // --- Overall Delivery Status ---

            updateOverallDeliveryStatus: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/overallDeliveryStatus'
            },

            // --- Log status area

            updateStatusAreaReview: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/status-area-reviews/:statusAreaReviewId'
            },
            
            // --- Approval --

            submitStatusUpdate: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/submit'
            },

            approveStatusUpdate: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/approve'
            },

            rejectStatusUpdate: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/reject'
            },

            draftStatusUpdate: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/portfolio-status-updates/:portfolioStatusUpdateId/draft'
            }
            
		});
	}
]);

/*

 GET (using "getById"): add "query" properties to set return-properties and deep populate in addition to the "portfolioId"

 if(req.query.retPropertiesString){
 retPropertiesString = req.query.retPropertiesString;
 }

 if(req.query.deepPopulateArray){
 deepPopulateArray = req.query.deepPopulateArray;
 }

 QUERY (using "list"): the server will automatically filter the return objects based on any property added to the "query"


 */
