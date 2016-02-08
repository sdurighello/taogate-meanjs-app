'use strict';

//Project review types service used to communicate Project review types REST endpoints
angular.module('project-review-setup').factory('ProjectReviewTypes', ['$resource',
	function($resource) {
		return $resource('project-review-types/:projectReviewTypeId', { projectReviewTypeId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
