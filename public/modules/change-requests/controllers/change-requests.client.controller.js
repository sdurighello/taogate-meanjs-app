'use strict';

// Change requests controller
angular.module('change-requests').controller('ChangeRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ChangeRequests',
	function($scope, $stateParams, $location, Authentication, ChangeRequests) {
		$scope.authentication = Authentication;

		// Create new Change request
		$scope.create = function() {
			// Create new Change request object
			var changeRequest = new ChangeRequests ({
				name: this.name
			});

			// Redirect after save
			changeRequest.$save(function(response) {
				$location.path('change-requests/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Change request
		$scope.remove = function(changeRequest) {
			if ( changeRequest ) { 
				changeRequest.$remove();

				for (var i in $scope.changeRequests) {
					if ($scope.changeRequests [i] === changeRequest) {
						$scope.changeRequests.splice(i, 1);
					}
				}
			} else {
				$scope.changeRequest.$remove(function() {
					$location.path('change-requests');
				});
			}
		};

		// Update existing Change request
		$scope.update = function() {
			var changeRequest = $scope.changeRequest;

			changeRequest.$update(function() {
				$location.path('change-requests/' + changeRequest._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Change requests
		$scope.find = function() {
			$scope.changeRequests = ChangeRequests.query();
		};

		// Find existing Change request
		$scope.findOne = function() {
			$scope.changeRequest = ChangeRequests.get({ 
				changeRequestId: $stateParams.changeRequestId
			});
		};
	}
]);