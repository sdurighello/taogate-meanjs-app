'use strict';

//Projects service used to communicate Projects REST endpoints
angular.module('project-identification').factory('Projects', ['$resource',
	function($resource) {
		return $resource('projects/:projectId', { projectId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
            updateStrategyAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/strategyAssignment'
                // req.body: {valueId: category value id}
            },
			updatePortfolioAssignment: {
				method: 'PUT',
				url: 'projects/:projectId/portfolioAssignment'
				// req.body: {valueId: category value id}
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
			},

            // ------- DELIVERY PROCESS -------

            confirmAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/confirmAssignment'
                // req.body: {processId: gate process id}
            },
            customAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/customAssignment'
                // req.body: {processId: gate process id}
            },
            standardAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/standardAssignment'
                // req.body: {processId: gate process id}
            },
            removeAssignment: {
                method: 'PUT',
                url: 'projects/:projectId/removeAssignment'
                // req.body: {processId: gate process id}
            },

            // --- Process header ---
            
            updateProcess: {
                method: 'PUT',
                url: 'projects/:projectId/updateProcess'
            },
            
            // --- Gate ---

            createGate: {
                method: 'PUT',
                url: 'projects/:projectId/createGate'
            },
            updateGateHeader: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/updateHeader'
            },
            updateGatePosition: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/updatePosition'
            },
            deleteGate: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/delete'
            },

            // --- Outcome ---

            createOutcome: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createOutcome'
            },
            updateOutcome: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-outcomes/:projectOutcomeId/update'
            },
            deleteOutcome: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/project-outcomes/:projectOutcomeId/delete'
            },

            // --- Approval --

            submitProcess: {
                method: 'PUT',
                url: 'projects/:projectId/submitProcess'
            },
            approveProcess: {
                method: 'PUT',
                url: 'projects/:projectId/approveProcess'
            },
            rejectProcess: {
                method: 'PUT',
                url: 'projects/:projectId/rejectProcess'
            },
            draftProcess: {
                method: 'PUT',
                url: 'projects/:projectId/draftProcess'
            },


            // --- GATE REVIEWS --

            createGateReview: {
                method: 'PUT',
                url: 'projects/:projectId/project-gates/:projectGateId/createGateReview'
                // req.body: {new gate review object}
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
