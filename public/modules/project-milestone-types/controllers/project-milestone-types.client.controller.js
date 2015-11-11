'use strict';

// Project milestone types controller
angular.module('project-milestone-types').controller('ProjectMilestoneTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ProjectMilestoneTypes',
	function($scope, $stateParams, $location, Authentication, ProjectMilestoneTypes) {
		$scope.authentication = Authentication;

		// Create new Project milestone type
		$scope.create = function() {
			// Create new Project milestone type object
			var projectMilestoneType = new ProjectMilestoneTypes ({
				name: this.name
			});

			// Redirect after save
			projectMilestoneType.$save(function(response) {
				$location.path('project-milestone-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project milestone type
		$scope.remove = function(projectMilestoneType) {
			if ( projectMilestoneType ) { 
				projectMilestoneType.$remove();

				for (var i in $scope.projectMilestoneTypes) {
					if ($scope.projectMilestoneTypes [i] === projectMilestoneType) {
						$scope.projectMilestoneTypes.splice(i, 1);
					}
				}
			} else {
				$scope.projectMilestoneType.$remove(function() {
					$location.path('project-milestone-types');
				});
			}
		};

		// Update existing Project milestone type
		$scope.update = function() {
			var projectMilestoneType = $scope.projectMilestoneType;

			projectMilestoneType.$update(function() {
				$location.path('project-milestone-types/' + projectMilestoneType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Project milestone types
		$scope.find = function() {
			$scope.projectMilestoneTypes = ProjectMilestoneTypes.query();
		};

		// Find existing Project milestone type
		$scope.findOne = function() {
			$scope.projectMilestoneType = ProjectMilestoneTypes.get({ 
				projectMilestoneTypeId: $stateParams.projectMilestoneTypeId
			});
		};
	}
]);