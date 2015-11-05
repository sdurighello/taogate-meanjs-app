'use strict';

// Risk probabilities controller
angular.module('risk-probabilities').controller('RiskProbabilitiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'RiskProbabilities',
	function($scope, $stateParams, $location, Authentication, RiskProbabilities) {
		$scope.authentication = Authentication;

		// Create new Risk probability
		$scope.create = function() {
			// Create new Risk probability object
			var riskProbability = new RiskProbabilities ({
				name: this.name
			});

			// Redirect after save
			riskProbability.$save(function(response) {
				$location.path('risk-probabilities/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Risk probability
		$scope.remove = function(riskProbability) {
			if ( riskProbability ) { 
				riskProbability.$remove();

				for (var i in $scope.riskProbabilities) {
					if ($scope.riskProbabilities [i] === riskProbability) {
						$scope.riskProbabilities.splice(i, 1);
					}
				}
			} else {
				$scope.riskProbability.$remove(function() {
					$location.path('risk-probabilities');
				});
			}
		};

		// Update existing Risk probability
		$scope.update = function() {
			var riskProbability = $scope.riskProbability;

			riskProbability.$update(function() {
				$location.path('risk-probabilities/' + riskProbability._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Risk probabilities
		$scope.find = function() {
			$scope.riskProbabilities = RiskProbabilities.query();
		};

		// Find existing Risk probability
		$scope.findOne = function() {
			$scope.riskProbability = RiskProbabilities.get({ 
				riskProbabilityId: $stateParams.riskProbabilityId
			});
		};
	}
]);