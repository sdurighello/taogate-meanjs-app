'use strict';

// Issue action states controller
angular.module('issue-action-states').controller('IssueActionStatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'IssueActionStates',
	function($scope, $stateParams, $location, Authentication, IssueActionStates) {
		$scope.authentication = Authentication;

		// Create new Issue action state
		$scope.create = function() {
			// Create new Issue action state object
			var issueActionState = new IssueActionStates ({
				name: this.name
			});

			// Redirect after save
			issueActionState.$save(function(response) {
				$location.path('issue-action-states/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Issue action state
		$scope.remove = function(issueActionState) {
			if ( issueActionState ) { 
				issueActionState.$remove();

				for (var i in $scope.issueActionStates) {
					if ($scope.issueActionStates [i] === issueActionState) {
						$scope.issueActionStates.splice(i, 1);
					}
				}
			} else {
				$scope.issueActionState.$remove(function() {
					$location.path('issue-action-states');
				});
			}
		};

		// Update existing Issue action state
		$scope.update = function() {
			var issueActionState = $scope.issueActionState;

			issueActionState.$update(function() {
				$location.path('issue-action-states/' + issueActionState._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Issue action states
		$scope.find = function() {
			$scope.issueActionStates = IssueActionStates.query();
		};

		// Find existing Issue action state
		$scope.findOne = function() {
			$scope.issueActionState = IssueActionStates.get({ 
				issueActionStateId: $stateParams.issueActionStateId
			});
		};
	}
]);