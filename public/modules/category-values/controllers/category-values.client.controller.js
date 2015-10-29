'use strict';

// Category values controller
angular.module('category-values').controller('CategoryValuesController', ['$scope', '$stateParams', '$location', 'Authentication', 'CategoryValues',
	function($scope, $stateParams, $location, Authentication, CategoryValues) {
		$scope.authentication = Authentication;

		// Create new Category value
		$scope.create = function() {
			// Create new Category value object
			var categoryValue = new CategoryValues ({
				name: this.name
			});

			// Redirect after save
			categoryValue.$save(function(response) {
				$location.path('category-values/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Category value
		$scope.remove = function(categoryValue) {
			if ( categoryValue ) { 
				categoryValue.$remove();

				for (var i in $scope.categoryValues) {
					if ($scope.categoryValues [i] === categoryValue) {
						$scope.categoryValues.splice(i, 1);
					}
				}
			} else {
				$scope.categoryValue.$remove(function() {
					$location.path('category-values');
				});
			}
		};

		// Update existing Category value
		$scope.update = function() {
			var categoryValue = $scope.categoryValue;

			categoryValue.$update(function() {
				$location.path('category-values/' + categoryValue._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Category values
		$scope.find = function() {
			$scope.categoryValues = CategoryValues.query();
		};

		// Find existing Category value
		$scope.findOne = function() {
			$scope.categoryValue = CategoryValues.get({ 
				categoryValueId: $stateParams.categoryValueId
			});
		};
	}
]);