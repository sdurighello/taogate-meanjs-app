'use strict';

// Gates controller
angular.module('gates').controller('GatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gates',
	function($scope, $stateParams, $location, Authentication, Gates) {
		$scope.authentication = Authentication;

		// Create new Gate
		$scope.create = function() {
			// Create new Gate object
			var gate = new Gates ({
				name: this.name
			});

			// Redirect after save
			gate.$save(function(response) {
				$location.path('gates/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gate
		$scope.remove = function(gate) {
			if ( gate ) { 
				gate.$remove();

				for (var i in $scope.gates) {
					if ($scope.gates [i] === gate) {
						$scope.gates.splice(i, 1);
					}
				}
			} else {
				$scope.gate.$remove(function() {
					$location.path('gates');
				});
			}
		};

		// Update existing Gate
		$scope.update = function() {
			var gate = $scope.gate;

			gate.$update(function() {
				$location.path('gates/' + gate._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gates
		$scope.find = function() {
			$scope.gates = Gates.query();
		};

		// Find existing Gate
		$scope.findOne = function() {
			$scope.gate = Gates.get({ 
				gateId: $stateParams.gateId
			});
		};
	}
]);