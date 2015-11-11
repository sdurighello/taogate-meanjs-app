'use strict';

// Change request states controller
angular.module('change-request-states').controller('ChangeRequestStatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ChangeRequestStates',
	function($scope, $stateParams, $location, Authentication, ChangeRequestStates) {
		$scope.authentication = Authentication;

		// Create new Change request state
		$scope.create = function() {
			// Create new Change request state object
			var changeRequestState = new ChangeRequestStates ({
				name: this.name
			});

			// Redirect after save
			changeRequestState.$save(function(response) {
				$location.path('change-request-states/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Change request state
		$scope.remove = function(changeRequestState) {
			if ( changeRequestState ) { 
				changeRequestState.$remove();

				for (var i in $scope.changeRequestStates) {
					if ($scope.changeRequestStates [i] === changeRequestState) {
						$scope.changeRequestStates.splice(i, 1);
					}
				}
			} else {
				$scope.changeRequestState.$remove(function() {
					$location.path('change-request-states');
				});
			}
		};

		// Update existing Change request state
		$scope.update = function() {
			var changeRequestState = $scope.changeRequestState;

			changeRequestState.$update(function() {
				$location.path('change-request-states/' + changeRequestState._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Change request states
		$scope.find = function() {
			$scope.changeRequestStates = ChangeRequestStates.query();
		};

		// Find existing Change request state
		$scope.findOne = function() {
			$scope.changeRequestState = ChangeRequestStates.get({ 
				changeRequestStateId: $stateParams.changeRequestStateId
			});
		};
	}
]);