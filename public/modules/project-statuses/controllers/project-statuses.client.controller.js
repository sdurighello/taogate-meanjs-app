'use strict';

// Project statuses controller
angular.module('project-statuses').controller('ProjectStatusesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ProjectStatuses',
	function($scope, $stateParams, $location, Authentication, ProjectStatuses) {
		$scope.authentication = Authentication;

		// Create new Project status
		$scope.create = function() {
			// Create new Project status object
			var projectStatus = new ProjectStatuses ({
				name: this.name
			});

			// Redirect after save
			projectStatus.$save(function(response) {
				$location.path('project-statuses/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project status
		$scope.remove = function(projectStatus) {
			if ( projectStatus ) { 
				projectStatus.$remove();

				for (var i in $scope.projectStatuses) {
					if ($scope.projectStatuses [i] === projectStatus) {
						$scope.projectStatuses.splice(i, 1);
					}
				}
			} else {
				$scope.projectStatus.$remove(function() {
					$location.path('project-statuses');
				});
			}
		};

		// Update existing Project status
		$scope.update = function() {
			var projectStatus = $scope.projectStatus;

			projectStatus.$update(function() {
				$location.path('project-statuses/' + projectStatus._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Project statuses
		$scope.find = function() {
			$scope.projectStatuses = ProjectStatuses.query();
		};

		// Find existing Project status
		$scope.findOne = function() {
			$scope.projectStatus = ProjectStatuses.get({ 
				projectStatusId: $stateParams.projectStatusId
			});
		};
	}
]);