'use strict';

// Log reasons controller
angular.module('log-reasons').controller('LogReasonsController', ['$scope', '$stateParams', '$location', 'Authentication', 'LogReasons',
	function($scope, $stateParams, $location, Authentication, LogReasons) {
		$scope.authentication = Authentication;

		// Create new Log reason
		$scope.create = function() {
			// Create new Log reason object
			var logReason = new LogReasons ({
				name: this.name
			});

			// Redirect after save
			logReason.$save(function(response) {
				$location.path('log-reasons/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Log reason
		$scope.remove = function(logReason) {
			if ( logReason ) { 
				logReason.$remove();

				for (var i in $scope.logReasons) {
					if ($scope.logReasons [i] === logReason) {
						$scope.logReasons.splice(i, 1);
					}
				}
			} else {
				$scope.logReason.$remove(function() {
					$location.path('log-reasons');
				});
			}
		};

		// Update existing Log reason
		$scope.update = function() {
			var logReason = $scope.logReason;

			logReason.$update(function() {
				$location.path('log-reasons/' + logReason._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Log reasons
		$scope.find = function() {
			$scope.logReasons = LogReasons.query();
		};

		// Find existing Log reason
		$scope.findOne = function() {
			$scope.logReason = LogReasons.get({ 
				logReasonId: $stateParams.logReasonId
			});
		};
	}
]);