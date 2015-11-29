'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('projects').factory('Projects', ['$resource',
	function($resource) {
		return $resource('projects/:projectId', { projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            updateCategoryAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/categoryAssignment/:assignedGroupId/:assignedCategoryId'
                // req.body: {valueId: category value id}
            },
            updatePriorityAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/priorityAssignment/:assignedGroupId/:assignedPriorityId'
                // req.body: {valueId: priority value id}
            },
            updateImpactAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/impactAssignment/:assignedGroupId/:assignedImpactId'
                // req.body: {scoreId: impact score id}
            },
            updateRiskAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/riskAssignment/:assignedCategoryId/:assignedRiskId'
                // req.body: {probabilityId: risk probability id, impactId: risk impact id}
            },
            updatePeopleAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/stakeholders/:assignedGroupId/:assignedRoleId'
                // req.body: {the whole "assignedRole" object}
            }
		});
	}
]);

/*

GET (using "getById"): add "query" properties to set return-properties and deep populate in addition to the "projectId"

 if(req.query.retPropertiesString){
    retPropertiesString = req.query.retPropertiesString;
 }

 if(req.query.deepPopulateArray){
    deepPopulateArray = req.query.deepPopulateArray;
 }

QUERY (using "list"): the server will automatically filter the return objects based on any property added to the "query"

 if(!_.isEmpty(req.query)){
    for (var property in req.query) {
        if (req.query.hasOwnProperty(property)) {
            queryObj[property] = req.query[property];
        }
    }
 }

 */
