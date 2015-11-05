'use strict';

// Risk severity assignments controller
angular.module('risk-severity-assignments').controller('RiskSeverityAssignmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'RiskSeverityAssignments',
	function($scope, $stateParams, $location, Authentication, RiskSeverityAssignments) {
		$scope.authentication = Authentication;

		// Create new Risk severity assignment
		$scope.create = function() {
			// Create new Risk severity assignment object
			var riskSeverityAssignment = new RiskSeverityAssignments ({
				name: this.name
			});

			// Redirect after save
			riskSeverityAssignment.$save(function(response) {
				$location.path('risk-severity-assignments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Risk severity assignment
		$scope.remove = function(riskSeverityAssignment) {
			if ( riskSeverityAssignment ) { 
				riskSeverityAssignment.$remove();

				for (var i in $scope.riskSeverityAssignments) {
					if ($scope.riskSeverityAssignments [i] === riskSeverityAssignment) {
						$scope.riskSeverityAssignments.splice(i, 1);
					}
				}
			} else {
				$scope.riskSeverityAssignment.$remove(function() {
					$location.path('risk-severity-assignments');
				});
			}
		};

		// Update existing Risk severity assignment
		$scope.update = function() {
			var riskSeverityAssignment = $scope.riskSeverityAssignment;

			riskSeverityAssignment.$update(function() {
				$location.path('risk-severity-assignments/' + riskSeverityAssignment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Risk severity assignments
		$scope.find = function() {
			$scope.riskSeverityAssignments = RiskSeverityAssignments.query();
		};

		// Find existing Risk severity assignment
		$scope.findOne = function() {
			$scope.riskSeverityAssignment = RiskSeverityAssignments.get({ 
				riskSeverityAssignmentId: $stateParams.riskSeverityAssignmentId
			});
		};
	}
]);