'use strict';

// People category values controller
angular.module('people-category-values').controller('PeopleCategoryValuesController', ['$scope', '$stateParams', '$location', 'Authentication', 'PeopleCategoryValues',
	function($scope, $stateParams, $location, Authentication, PeopleCategoryValues) {
		$scope.authentication = Authentication;

		// Create new People category value
		$scope.create = function() {
			// Create new People category value object
			var peopleCategoryValue = new PeopleCategoryValues ({
				name: this.name
			});

			// Redirect after save
			peopleCategoryValue.$save(function(response) {
				$location.path('people-category-values/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing People category value
		$scope.remove = function(peopleCategoryValue) {
			if ( peopleCategoryValue ) { 
				peopleCategoryValue.$remove();

				for (var i in $scope.peopleCategoryValues) {
					if ($scope.peopleCategoryValues [i] === peopleCategoryValue) {
						$scope.peopleCategoryValues.splice(i, 1);
					}
				}
			} else {
				$scope.peopleCategoryValue.$remove(function() {
					$location.path('people-category-values');
				});
			}
		};

		// Update existing People category value
		$scope.update = function() {
			var peopleCategoryValue = $scope.peopleCategoryValue;

			peopleCategoryValue.$update(function() {
				$location.path('people-category-values/' + peopleCategoryValue._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of People category values
		$scope.find = function() {
			$scope.peopleCategoryValues = PeopleCategoryValues.query();
		};

		// Find existing People category value
		$scope.findOne = function() {
			$scope.peopleCategoryValue = PeopleCategoryValues.get({ 
				peopleCategoryValueId: $stateParams.peopleCategoryValueId
			});
		};
	}
]);