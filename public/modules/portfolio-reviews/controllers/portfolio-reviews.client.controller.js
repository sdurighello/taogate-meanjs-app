'use strict';

// Portfolio reviews controller
angular.module('portfolio-reviews').controller('PortfolioReviewsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PortfolioReviews',
	function($scope, $stateParams, $location, Authentication, PortfolioReviews) {
		$scope.authentication = Authentication;

		// Create new Portfolio review
		$scope.create = function() {
			// Create new Portfolio review object
			var portfolioReview = new PortfolioReviews ({
				name: this.name
			});

			// Redirect after save
			portfolioReview.$save(function(response) {
				$location.path('portfolio-reviews/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Portfolio review
		$scope.remove = function(portfolioReview) {
			if ( portfolioReview ) { 
				portfolioReview.$remove();

				for (var i in $scope.portfolioReviews) {
					if ($scope.portfolioReviews [i] === portfolioReview) {
						$scope.portfolioReviews.splice(i, 1);
					}
				}
			} else {
				$scope.portfolioReview.$remove(function() {
					$location.path('portfolio-reviews');
				});
			}
		};

		// Update existing Portfolio review
		$scope.update = function() {
			var portfolioReview = $scope.portfolioReview;

			portfolioReview.$update(function() {
				$location.path('portfolio-reviews/' + portfolioReview._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Portfolio reviews
		$scope.find = function() {
			$scope.portfolioReviews = PortfolioReviews.query();
		};

		// Find existing Portfolio review
		$scope.findOne = function() {
			$scope.portfolioReview = PortfolioReviews.get({ 
				portfolioReviewId: $stateParams.portfolioReviewId
			});
		};
	}
]);