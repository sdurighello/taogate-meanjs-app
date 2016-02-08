'use strict';

//Project review scores service used to communicate Project review scores REST endpoints
angular.module('project-review-setup').factory('ProjectReviewScores', ['$resource',
	function($resource) {
		return $resource('project-review-scores/:projectReviewScoreId', { projectReviewScoreId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
