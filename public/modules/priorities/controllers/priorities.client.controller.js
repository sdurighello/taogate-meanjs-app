'use strict';

// Priorities controller
angular.module('priorities').controller('PrioritiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Priorities',
	function($scope, $stateParams, $location, Authentication, Priorities) {
		$scope.authentication = Authentication;

		// Create new Priority
		$scope.create = function() {
			// Create new Priority object
			var priority = new Priorities ({
				name: this.name
			});

			// Redirect after save
			priority.$save(function(response) {
				$location.path('priorities/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Priority
		$scope.remove = function(priority) {
			if ( priority ) { 
				priority.$remove();

				for (var i in $scope.priorities) {
					if ($scope.priorities [i] === priority) {
						$scope.priorities.splice(i, 1);
					}
				}
			} else {
				$scope.priority.$remove(function() {
					$location.path('priorities');
				});
			}
		};

		// Update existing Priority
		$scope.update = function() {
			var priority = $scope.priority;

			priority.$update(function() {
				$location.path('priorities/' + priority._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Priorities
		$scope.find = function() {
			$scope.priorities = Priorities.query();
		};

		// Find existing Priority
		$scope.findOne = function() {
			$scope.priority = Priorities.get({ 
				priorityId: $stateParams.priorityId
			});
		};
	}
]);