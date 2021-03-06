'use strict';

//Portfolios service used to communicate Portfolios REST endpoints
angular.module('portfolio-setup').factory('Portfolios', ['$resource',
	function($resource) {
		return $resource('portfolios/:portfolioId', { portfolioId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},

            // Stakeholders

            createAssignedRole: {
                method: 'POST',
                url: 'portfolios/:portfolioId/stakeholders/:assignedGroupId/assignedRoles'
                // req.body: {the whole "assignedRole" object}
            },

            updateAssignedRole: {
                method: 'PUT',
                url: 'portfolios/:portfolioId/stakeholders/:assignedGroupId/assignedRoles/:assignedRoleId'
                // req.body: {the whole "assignedRole" object}
            },

            deleteAssignedRole: {
                method: 'DELETE',
                url: 'portfolios/:portfolioId/stakeholders/:assignedGroupId/assignedRoles/:assignedRoleId'
                // req.body: {the whole "assignedRole" object}
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
