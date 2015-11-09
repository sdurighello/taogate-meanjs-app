'use strict';

// Gate processes controller
angular.module('gate-processes').controller('GateProcessesController', ['$scope', '$stateParams', '$location', 'Authentication', 'GateProcesses',
	function($scope, $stateParams, $location, Authentication, GateProcesses) {
		$scope.authentication = Authentication;

		// Create new Gate process
		$scope.create = function() {
			// Create new Gate process object
			var gateProcess = new GateProcesses ({
				name: this.name
			});

			// Redirect after save
			gateProcess.$save(function(response) {
				$location.path('gate-processes/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gate process
		$scope.remove = function(gateProcess) {
			if ( gateProcess ) { 
				gateProcess.$remove();

				for (var i in $scope.gateProcesses) {
					if ($scope.gateProcesses [i] === gateProcess) {
						$scope.gateProcesses.splice(i, 1);
					}
				}
			} else {
				$scope.gateProcess.$remove(function() {
					$location.path('gate-processes');
				});
			}
		};

		// Update existing Gate process
		$scope.update = function() {
			var gateProcess = $scope.gateProcess;

			gateProcess.$update(function() {
				$location.path('gate-processes/' + gateProcess._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gate processes
		$scope.find = function() {
			$scope.gateProcesses = GateProcesses.query();
		};

		// Find existing Gate process
		$scope.findOne = function() {
			$scope.gateProcess = GateProcesses.get({ 
				gateProcessId: $stateParams.gateProcessId
			});
		};
	}
]);