'use strict';

// Milestone types controller
angular.module('milestone-types').controller('MilestoneTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'MilestoneTypes',
	function($scope, $stateParams, $location, Authentication, MilestoneTypes) {
		$scope.authentication = Authentication;

		// Create new Milestone type
		$scope.create = function() {
			// Create new Milestone type object
			var milestoneType = new MilestoneTypes ({
				name: this.name
			});

			// Redirect after save
			milestoneType.$save(function(response) {
				$location.path('milestone-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Milestone type
		$scope.remove = function(milestoneType) {
			if ( milestoneType ) { 
				milestoneType.$remove();

				for (var i in $scope.milestoneTypes) {
					if ($scope.milestoneTypes [i] === milestoneType) {
						$scope.milestoneTypes.splice(i, 1);
					}
				}
			} else {
				$scope.milestoneType.$remove(function() {
					$location.path('milestone-types');
				});
			}
		};

		// Update existing Milestone type
		$scope.update = function() {
			var milestoneType = $scope.milestoneType;

			milestoneType.$update(function() {
				$location.path('milestone-types/' + milestoneType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Milestone types
		$scope.find = function() {
			$scope.milestoneTypes = MilestoneTypes.query();
		};

		// Find existing Milestone type
		$scope.findOne = function() {
			$scope.milestoneType = MilestoneTypes.get({ 
				milestoneTypeId: $stateParams.milestoneTypeId
			});
		};
	}
]);