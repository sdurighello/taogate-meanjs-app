'use strict';

// Risk impacts controller
angular.module('risk-impacts').controller('RiskImpactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'RiskImpacts',
	function($scope, $stateParams, $location, Authentication, RiskImpacts) {
		$scope.authentication = Authentication;

		// Create new Risk impact
		$scope.create = function() {
			// Create new Risk impact object
			var riskImpact = new RiskImpacts ({
				name: this.name
			});

			// Redirect after save
			riskImpact.$save(function(response) {
				$location.path('risk-impacts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Risk impact
		$scope.remove = function(riskImpact) {
			if ( riskImpact ) { 
				riskImpact.$remove();

				for (var i in $scope.riskImpacts) {
					if ($scope.riskImpacts [i] === riskImpact) {
						$scope.riskImpacts.splice(i, 1);
					}
				}
			} else {
				$scope.riskImpact.$remove(function() {
					$location.path('risk-impacts');
				});
			}
		};

		// Update existing Risk impact
		$scope.update = function() {
			var riskImpact = $scope.riskImpact;

			riskImpact.$update(function() {
				$location.path('risk-impacts/' + riskImpact._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Risk impacts
		$scope.find = function() {
			$scope.riskImpacts = RiskImpacts.query();
		};

		// Find existing Risk impact
		$scope.findOne = function() {
			$scope.riskImpact = RiskImpacts.get({ 
				riskImpactId: $stateParams.riskImpactId
			});
		};
	}
]);