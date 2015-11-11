'use strict';

// Change request reasons controller
angular.module('change-request-reasons').controller('ChangeRequestReasonsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ChangeRequestReasons',
	function($scope, $stateParams, $location, Authentication, ChangeRequestReasons) {
		$scope.authentication = Authentication;

		// Create new Change request reason
		$scope.create = function() {
			// Create new Change request reason object
			var changeRequestReason = new ChangeRequestReasons ({
				name: this.name
			});

			// Redirect after save
			changeRequestReason.$save(function(response) {
				$location.path('change-request-reasons/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Change request reason
		$scope.remove = function(changeRequestReason) {
			if ( changeRequestReason ) { 
				changeRequestReason.$remove();

				for (var i in $scope.changeRequestReasons) {
					if ($scope.changeRequestReasons [i] === changeRequestReason) {
						$scope.changeRequestReasons.splice(i, 1);
					}
				}
			} else {
				$scope.changeRequestReason.$remove(function() {
					$location.path('change-request-reasons');
				});
			}
		};

		// Update existing Change request reason
		$scope.update = function() {
			var changeRequestReason = $scope.changeRequestReason;

			changeRequestReason.$update(function() {
				$location.path('change-request-reasons/' + changeRequestReason._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Change request reasons
		$scope.find = function() {
			$scope.changeRequestReasons = ChangeRequestReasons.query();
		};

		// Find existing Change request reason
		$scope.findOne = function() {
			$scope.changeRequestReason = ChangeRequestReasons.get({ 
				changeRequestReasonId: $stateParams.changeRequestReasonId
			});
		};
	}
]);