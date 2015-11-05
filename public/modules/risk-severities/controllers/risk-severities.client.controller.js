'use strict';

// Risk severities controller
angular.module('risk-severities').controller('RiskSeveritiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'RiskSeverities',
	function($scope, $stateParams, $location, Authentication, RiskSeverities) {
		$scope.authentication = Authentication;

		// Create new Risk severity
		$scope.create = function() {
			// Create new Risk severity object
			var riskSeverity = new RiskSeverities ({
				name: this.name
			});

			// Redirect after save
			riskSeverity.$save(function(response) {
				$location.path('risk-severities/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Risk severity
		$scope.remove = function(riskSeverity) {
			if ( riskSeverity ) { 
				riskSeverity.$remove();

				for (var i in $scope.riskSeverities) {
					if ($scope.riskSeverities [i] === riskSeverity) {
						$scope.riskSeverities.splice(i, 1);
					}
				}
			} else {
				$scope.riskSeverity.$remove(function() {
					$location.path('risk-severities');
				});
			}
		};

		// Update existing Risk severity
		$scope.update = function() {
			var riskSeverity = $scope.riskSeverity;

			riskSeverity.$update(function() {
				$location.path('risk-severities/' + riskSeverity._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Risk severities
		$scope.find = function() {
			$scope.riskSeverities = RiskSeverities.query();
		};

		// Find existing Risk severity
		$scope.findOne = function() {
			$scope.riskSeverity = RiskSeverities.get({ 
				riskSeverityId: $stateParams.riskSeverityId
			});
		};
	}
]);