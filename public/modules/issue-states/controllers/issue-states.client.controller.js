'use strict';

// Issue states controller
angular.module('issue-states').controller('IssueStatesController', ['$scope', '$stateParams', '$location', 'Authentication', 'IssueStates',
	function($scope, $stateParams, $location, Authentication, IssueStates) {
		$scope.authentication = Authentication;

		// Create new Issue state
		$scope.create = function() {
			// Create new Issue state object
			var issueState = new IssueStates ({
				name: this.name
			});

			// Redirect after save
			issueState.$save(function(response) {
				$location.path('issue-states/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Issue state
		$scope.remove = function(issueState) {
			if ( issueState ) { 
				issueState.$remove();

				for (var i in $scope.issueStates) {
					if ($scope.issueStates [i] === issueState) {
						$scope.issueStates.splice(i, 1);
					}
				}
			} else {
				$scope.issueState.$remove(function() {
					$location.path('issue-states');
				});
			}
		};

		// Update existing Issue state
		$scope.update = function() {
			var issueState = $scope.issueState;

			issueState.$update(function() {
				$location.path('issue-states/' + issueState._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Issue states
		$scope.find = function() {
			$scope.issueStates = IssueStates.query();
		};

		// Find existing Issue state
		$scope.findOne = function() {
			$scope.issueState = IssueStates.get({ 
				issueStateId: $stateParams.issueStateId
			});
		};
	}
]);