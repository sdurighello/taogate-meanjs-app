'use strict';

// Gate outcome scores controller
angular.module('gate-outcome-scores').controller('GateOutcomeScoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'GateOutcomeScores',
	function($scope, $stateParams, $location, Authentication, GateOutcomeScores) {
		$scope.authentication = Authentication;

		// Create new Gate outcome score
		$scope.create = function() {
			// Create new Gate outcome score object
			var gateOutcomeScore = new GateOutcomeScores ({
				name: this.name
			});

			// Redirect after save
			gateOutcomeScore.$save(function(response) {
				$location.path('gate-outcome-scores/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gate outcome score
		$scope.remove = function(gateOutcomeScore) {
			if ( gateOutcomeScore ) { 
				gateOutcomeScore.$remove();

				for (var i in $scope.gateOutcomeScores) {
					if ($scope.gateOutcomeScores [i] === gateOutcomeScore) {
						$scope.gateOutcomeScores.splice(i, 1);
					}
				}
			} else {
				$scope.gateOutcomeScore.$remove(function() {
					$location.path('gate-outcome-scores');
				});
			}
		};

		// Update existing Gate outcome score
		$scope.update = function() {
			var gateOutcomeScore = $scope.gateOutcomeScore;

			gateOutcomeScore.$update(function() {
				$location.path('gate-outcome-scores/' + gateOutcomeScore._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gate outcome scores
		$scope.find = function() {
			$scope.gateOutcomeScores = GateOutcomeScores.query();
		};

		// Find existing Gate outcome score
		$scope.findOne = function() {
			$scope.gateOutcomeScore = GateOutcomeScores.get({ 
				gateOutcomeScoreId: $stateParams.gateOutcomeScoreId
			});
		};
	}
]);