'use strict';

//Setting up route
angular.module('project-reviews').config(['$stateProvider',
	function($stateProvider) {
		// Project reviews state routing
		$stateProvider.
		state('listProjectReviews', {
			url: '/project-reviews',
			templateUrl: 'modules/project-reviews/views/list-project-reviews.client.view.html'
		}).
		state('createProjectReview', {
			url: '/project-reviews/create',
			templateUrl: 'modules/project-reviews/views/create-project-review.client.view.html'
		}).
		state('viewProjectReview', {
			url: '/project-reviews/:projectReviewId',
			templateUrl: 'modules/project-reviews/views/view-project-review.client.view.html'
		}).
		state('editProjectReview', {
			url: '/project-reviews/:projectReviewId/edit',
			templateUrl: 'modules/project-reviews/views/edit-project-review.client.view.html'
		});
	}
]);