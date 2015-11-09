'use strict';

// Gate statuses controller
angular.module('gate-statuses').controller('GateStatusesController', ['$scope', '$stateParams', '$location', 'Authentication', 'GateStatuses',
	function($scope, $stateParams, $location, Authentication, GateStatuses) {
		$scope.authentication = Authentication;

		// Create new Gate status
		$scope.create = function() {
			// Create new Gate status object
			var gateStatus = new GateStatuses ({
				name: this.name
			});

			// Redirect after save
			gateStatus.$save(function(response) {
				$location.path('gate-statuses/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gate status
		$scope.remove = function(gateStatus) {
			if ( gateStatus ) { 
				gateStatus.$remove();

				for (var i in $scope.gateStatuses) {
					if ($scope.gateStatuses [i] === gateStatus) {
						$scope.gateStatuses.splice(i, 1);
					}
				}
			} else {
				$scope.gateStatus.$remove(function() {
					$location.path('gate-statuses');
				});
			}
		};

		// Update existing Gate status
		$scope.update = function() {
			var gateStatus = $scope.gateStatus;

			gateStatus.$update(function() {
				$location.path('gate-statuses/' + gateStatus._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gate statuses
		$scope.find = function() {
			$scope.gateStatuses = GateStatuses.query();
		};

		// Find existing Gate status
		$scope.findOne = function() {
			$scope.gateStatus = GateStatuses.get({ 
				gateStatusId: $stateParams.gateStatusId
			});
		};
	}
]);