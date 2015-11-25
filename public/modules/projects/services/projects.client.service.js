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
                url: 'projects/categoryAssignment/:projectId/:assignedGroupId/:assignedCategoryId/:valueId'
            },
            updatePriorityAssignment: {
                method: 'PUT',
                url: 'projects/priorityAssignment/:projectId/:assignedGroupId/:assignedPriorityId/:valueId'
            },
            updateImpactAssignment: {
                method: 'PUT',
                url: 'projects/impactAssignment/:projectId/:assignedGroupId/:assignedImpactId/:scoreId'
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
