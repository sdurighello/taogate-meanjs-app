'use strict';

// Dependency types controller
angular.module('dependency-types').controller('DependencyTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'DependencyTypes',
	function($scope, $stateParams, $location, Authentication, DependencyTypes) {
		$scope.authentication = Authentication;

		// Create new Dependency type
		$scope.create = function() {
			// Create new Dependency type object
			var dependencyType = new DependencyTypes ({
				name: this.name
			});

			// Redirect after save
			dependencyType.$save(function(response) {
				$location.path('dependency-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dependency type
		$scope.remove = function(dependencyType) {
			if ( dependencyType ) { 
				dependencyType.$remove();

				for (var i in $scope.dependencyTypes) {
					if ($scope.dependencyTypes [i] === dependencyType) {
						$scope.dependencyTypes.splice(i, 1);
					}
				}
			} else {
				$scope.dependencyType.$remove(function() {
					$location.path('dependency-types');
				});
			}
		};

		// Update existing Dependency type
		$scope.update = function() {
			var dependencyType = $scope.dependencyType;

			dependencyType.$update(function() {
				$location.path('dependency-types/' + dependencyType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dependency types
		$scope.find = function() {
			$scope.dependencyTypes = DependencyTypes.query();
		};

		// Find existing Dependency type
		$scope.findOne = function() {
			$scope.dependencyType = DependencyTypes.get({ 
				dependencyTypeId: $stateParams.dependencyTypeId
			});
		};
	}
]);