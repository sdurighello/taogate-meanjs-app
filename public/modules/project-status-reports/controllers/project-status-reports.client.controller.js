'use strict';

// Project status reports controller
angular.module('project-status-reports').controller('ProjectStatusReportsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ProjectStatusReports',
	function($scope, $stateParams, $location, Authentication, ProjectStatusReports) {
		$scope.authentication = Authentication;

		// Create new Project status report
		$scope.create = function() {
			// Create new Project status report object
			var projectStatusReport = new ProjectStatusReports ({
				name: this.name
			});

			// Redirect after save
			projectStatusReport.$save(function(response) {
				$location.path('project-status-reports/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Project status report
		$scope.remove = function(projectStatusReport) {
			if ( projectStatusReport ) { 
				projectStatusReport.$remove();

				for (var i in $scope.projectStatusReports) {
					if ($scope.projectStatusReports [i] === projectStatusReport) {
						$scope.projectStatusReports.splice(i, 1);
					}
				}
			} else {
				$scope.projectStatusReport.$remove(function() {
					$location.path('project-status-reports');
				});
			}
		};

		// Update existing Project status report
		$scope.update = function() {
			var projectStatusReport = $scope.projectStatusReport;

			projectStatusReport.$update(function() {
				$location.path('project-status-reports/' + projectStatusReport._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Project status reports
		$scope.find = function() {
			$scope.projectStatusReports = ProjectStatusReports.query();
		};

		// Find existing Project status report
		$scope.findOne = function() {
			$scope.projectStatusReport = ProjectStatusReports.get({ 
				projectStatusReportId: $stateParams.projectStatusReportId
			});
		};
	}
]);