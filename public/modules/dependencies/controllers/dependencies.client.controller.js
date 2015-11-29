'use strict';

// Dependencies controller
angular.module('dependencies').controller('DependenciesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Dependencies',
	function($scope, $stateParams, $location, Authentication, Dependencies) {
		$scope.authentication = Authentication;

		// Create new Dependency
		$scope.create = function() {
			// Create new Dependency object
			var dependency = new Dependencies ({
				name: this.name
			});

			// Redirect after save
			dependency.$save(function(response) {
				$location.path('dependencies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dependency
		$scope.remove = function(dependency) {
			if ( dependency ) { 
				dependency.$remove();

				for (var i in $scope.dependencies) {
					if ($scope.dependencies [i] === dependency) {
						$scope.dependencies.splice(i, 1);
					}
				}
			} else {
				$scope.dependency.$remove(function() {
					$location.path('dependencies');
				});
			}
		};

		// Update existing Dependency
		$scope.update = function() {
			var dependency = $scope.dependency;

			dependency.$update(function() {
				$location.path('dependencies/' + dependency._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dependencies
		$scope.find = function() {
			$scope.dependencies = Dependencies.query();
		};

		// Find existing Dependency
		$scope.findOne = function() {
			$scope.dependency = Dependencies.get({ 
				dependencyId: $stateParams.dependencyId
			});
		};
	}
]);