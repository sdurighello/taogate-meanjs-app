'use strict';

// Project change requests controller
angular.module('project-change-requests').controller('ProjectChangeRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ProjectChangeRequests',
	function($scope, $stateParams, $location, Authentication, ProjectChangeRequests) {
		$scope.authentication = Authentication;

		// Create new Project change request
		$scope.create = function() {
			// Create new Project change request object
			var projectChangeRequest = new ProjectChangeRequests ({
				name: this.name
			});

			// Redirect after save
			projectChangeRequest.$save(function(response) {
				$location.path('project-change-requests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project change request
		$scope.remove = function(projectChangeRequest) {
			if ( projectChangeRequest ) { 
				projectChangeRequest.$remove();

				for (var i in $scope.projectChangeRequests) {
					if ($scope.projectChangeRequests [i] === projectChangeRequest) {
						$scope.projectChangeRequests.splice(i, 1);
					}
				}
			} else {
				$scope.projectChangeRequest.$remove(function() {
					$location.path('project-change-requests');
				});
			}
		};

		// Update existing Project change request
		$scope.update = function() {
			var projectChangeRequest = $scope.projectChangeRequest;

			projectChangeRequest.$update(function() {
				$location.path('project-change-requests/' + projectChangeRequest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Project change requests
		$scope.find = function() {
			$scope.projectChangeRequests = ProjectChangeRequests.query();
		};

		// Find existing Project change request
		$scope.findOne = function() {
			$scope.projectChangeRequest = ProjectChangeRequests.get({ 
				projectChangeRequestId: $stateParams.projectChangeRequestId
			});
		};
	}
]);