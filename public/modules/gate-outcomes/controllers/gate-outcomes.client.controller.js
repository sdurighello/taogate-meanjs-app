'use strict';

// Gate outcomes controller
angular.module('gate-outcomes').controller('GateOutcomesController', ['$scope', '$stateParams', '$location', 'Authentication', 'GateOutcomes',
	function($scope, $stateParams, $location, Authentication, GateOutcomes) {
		$scope.authentication = Authentication;

		// Create new Gate outcome
		$scope.create = function() {
			// Create new Gate outcome object
			var gateOutcome = new GateOutcomes ({
				name: this.name
			});

			// Redirect after save
			gateOutcome.$save(function(response) {
				$location.path('gate-outcomes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gate outcome
		$scope.remove = function(gateOutcome) {
			if ( gateOutcome ) { 
				gateOutcome.$remove();

				for (var i in $scope.gateOutcomes) {
					if ($scope.gateOutcomes [i] === gateOutcome) {
						$scope.gateOutcomes.splice(i, 1);
					}
				}
			} else {
				$scope.gateOutcome.$remove(function() {
					$location.path('gate-outcomes');
				});
			}
		};

		// Update existing Gate outcome
		$scope.update = function() {
			var gateOutcome = $scope.gateOutcome;

			gateOutcome.$update(function() {
				$location.path('gate-outcomes/' + gateOutcome._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gate outcomes
		$scope.find = function() {
			$scope.gateOutcomes = GateOutcomes.query();
		};

		// Find existing Gate outcome
		$scope.findOne = function() {
			$scope.gateOutcome = GateOutcomes.get({ 
				gateOutcomeId: $stateParams.gateOutcomeId
			});
		};
	}
]);