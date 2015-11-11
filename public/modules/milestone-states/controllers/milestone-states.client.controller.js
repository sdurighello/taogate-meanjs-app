'use strict';

// Milestone states controller
angular.module('milestone-states').controller('MilestoneStatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'MilestoneStates',
	function($scope, $stateParams, $location, Authentication, MilestoneStates) {
		$scope.authentication = Authentication;

		// Create new Milestone state
		$scope.create = function() {
			// Create new Milestone state object
			var milestoneState = new MilestoneStates ({
				name: this.name
			});

			// Redirect after save
			milestoneState.$save(function(response) {
				$location.path('milestone-states/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Milestone state
		$scope.remove = function(milestoneState) {
			if ( milestoneState ) { 
				milestoneState.$remove();

				for (var i in $scope.milestoneStates) {
					if ($scope.milestoneStates [i] === milestoneState) {
						$scope.milestoneStates.splice(i, 1);
					}
				}
			} else {
				$scope.milestoneState.$remove(function() {
					$location.path('milestone-states');
				});
			}
		};

		// Update existing Milestone state
		$scope.update = function() {
			var milestoneState = $scope.milestoneState;

			milestoneState.$update(function() {
				$location.path('milestone-states/' + milestoneState._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Milestone states
		$scope.find = function() {
			$scope.milestoneStates = MilestoneStates.query();
		};

		// Find existing Milestone state
		$scope.findOne = function() {
			$scope.milestoneState = MilestoneStates.get({ 
				milestoneStateId: $stateParams.milestoneStateId
			});
		};
	}
]);