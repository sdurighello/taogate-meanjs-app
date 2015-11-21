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
            }
		});
	}
]);
