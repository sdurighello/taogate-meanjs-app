'use strict';

//Project reviews service used to communicate Project reviews REST endpoints
angular.module('project-reviews').factory('ProjectReviews', ['$resource',
	function($resource) {
		return $resource('project-reviews/:projectReviewId', { projectReviewId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);