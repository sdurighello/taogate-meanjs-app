'use strict';

// Dependency impacts controller
angular.module('dependency-impacts').controller('DependencyImpactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'DependencyImpacts',
	function($scope, $stateParams, $location, Authentication, DependencyImpacts) {
		$scope.authentication = Authentication;

		// Create new Dependency impact
		$scope.create = function() {
			// Create new Dependency impact object
			var dependencyImpact = new DependencyImpacts ({
				name: this.name
			});

			// Redirect after save
			dependencyImpact.$save(function(response) {
				$location.path('dependency-impacts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Dependency impact
		$scope.remove = function(dependencyImpact) {
			if ( dependencyImpact ) { 
				dependencyImpact.$remove();

				for (var i in $scope.dependencyImpacts) {
					if ($scope.dependencyImpacts [i] === dependencyImpact) {
						$scope.dependencyImpacts.splice(i, 1);
					}
				}
			} else {
				$scope.dependencyImpact.$remove(function() {
					$location.path('dependency-impacts');
				});
			}
		};

		// Update existing Dependency impact
		$scope.update = function() {
			var dependencyImpact = $scope.dependencyImpact;

			dependencyImpact.$update(function() {
				$location.path('dependency-impacts/' + dependencyImpact._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Dependency impacts
		$scope.find = function() {
			$scope.dependencyImpacts = DependencyImpacts.query();
		};

		// Find existing Dependency impact
		$scope.findOne = function() {
			$scope.dependencyImpact = DependencyImpacts.get({ 
				dependencyImpactId: $stateParams.dependencyImpactId
			});
		};
	}
]);