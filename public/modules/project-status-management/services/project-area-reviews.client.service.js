'use strict';

//Project area reviews service used to communicate Project area reviews REST endpoints
angular.module('project-status-management').factory('ProjectAreaReviews', ['$resource',
	function($resource) {
		return $resource('project-area-reviews/:projectAreaReviewId', { projectAreaReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
