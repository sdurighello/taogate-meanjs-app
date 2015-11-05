'use strict';

// Risk categories controller
angular.module('risk-categories').controller('RiskCategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'RiskCategories',
	function($scope, $stateParams, $location, Authentication, RiskCategories) {
		$scope.authentication = Authentication;

		// Create new Risk category
		$scope.create = function() {
			// Create new Risk category object
			var riskCategory = new RiskCategories ({
				name: this.name
			});

			// Redirect after save
			riskCategory.$save(function(response) {
				$location.path('risk-categories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Risk category
		$scope.remove = function(riskCategory) {
			if ( riskCategory ) { 
				riskCategory.$remove();

				for (var i in $scope.riskCategories) {
					if ($scope.riskCategories [i] === riskCategory) {
						$scope.riskCategories.splice(i, 1);
					}
				}
			} else {
				$scope.riskCategory.$remove(function() {
					$location.path('risk-categories');
				});
			}
		};

		// Update existing Risk category
		$scope.update = function() {
			var riskCategory = $scope.riskCategory;

			riskCategory.$update(function() {
				$location.path('risk-categories/' + riskCategory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Risk categories
		$scope.find = function() {
			$scope.riskCategories = RiskCategories.query();
		};

		// Find existing Risk category
		$scope.findOne = function() {
			$scope.riskCategory = RiskCategories.get({ 
				riskCategoryId: $stateParams.riskCategoryId
			});
		};
	}
]);