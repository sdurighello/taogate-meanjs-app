'use strict';

// Priority types controller
angular.module('priority-types').controller('PriorityTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'PriorityTypes',
	function($scope, $stateParams, $location, Authentication, PriorityTypes) {
		$scope.authentication = Authentication;

		// Create new Priority type
		$scope.create = function() {
			// Create new Priority type object
			var priorityType = new PriorityTypes ({
				name: this.name
			});

			// Redirect after save
			priorityType.$save(function(response) {
				$location.path('priority-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Priority type
		$scope.remove = function(priorityType) {
			if ( priorityType ) { 
				priorityType.$remove();

				for (var i in $scope.priorityTypes) {
					if ($scope.priorityTypes [i] === priorityType) {
						$scope.priorityTypes.splice(i, 1);
					}
				}
			} else {
				$scope.priorityType.$remove(function() {
					$location.path('priority-types');
				});
			}
		};

		// Update existing Priority type
		$scope.update = function() {
			var priorityType = $scope.priorityType;

			priorityType.$update(function() {
				$location.path('priority-types/' + priorityType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Priority types
		$scope.find = function() {
			$scope.priorityTypes = PriorityTypes.query();
		};

		// Find existing Priority type
		$scope.findOne = function() {
			$scope.priorityType = PriorityTypes.get({ 
				priorityTypeId: $stateParams.priorityTypeId
			});
		};
	}
]);