'use strict';

// Project reviews controller
angular.module('project-reviews').controller('ProjectReviewsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ProjectReviews',
	function($scope, $stateParams, $location, Authentication, ProjectReviews) {
		$scope.authentication = Authentication;

		// Create new Project review
		$scope.create = function() {
			// Create new Project review object
			var projectReview = new ProjectReviews ({
				name: this.name
			});

			// Redirect after save
			projectReview.$save(function(response) {
				$location.path('project-reviews/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project review
		$scope.remove = function(projectReview) {
			if ( projectReview ) { 
				projectReview.$remove();

				for (var i in $scope.projectReviews) {
					if ($scope.projectReviews [i] === projectReview) {
						$scope.projectReviews.splice(i, 1);
					}
				}
			} else {
				$scope.projectReview.$remove(function() {
					$location.path('project-reviews');
				});
			}
		};

		// Update existing Project review
		$scope.update = function() {
			var projectReview = $scope.projectReview;

			projectReview.$update(function() {
				$location.path('project-reviews/' + projectReview._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Project reviews
		$scope.find = function() {
			$scope.projectReviews = ProjectReviews.query();
		};

		// Find existing Project review
		$scope.findOne = function() {
			$scope.projectReview = ProjectReviews.get({ 
				projectReviewId: $stateParams.projectReviewId
			});
		};
	}
]);