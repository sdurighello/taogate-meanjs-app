'use strict';

// Issue reasons controller
angular.module('issue-reasons').controller('IssueReasonsController', ['$scope', '$stateParams', '$location', 'Authentication', 'IssueReasons',
	function($scope, $stateParams, $location, Authentication, IssueReasons) {
		$scope.authentication = Authentication;

		// Create new Issue reason
		$scope.create = function() {
			// Create new Issue reason object
			var issueReason = new IssueReasons ({
				name: this.name
			});

			// Redirect after save
			issueReason.$save(function(response) {
				$location.path('issue-reasons/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Issue reason
		$scope.remove = function(issueReason) {
			if ( issueReason ) { 
				issueReason.$remove();

				for (var i in $scope.issueReasons) {
					if ($scope.issueReasons [i] === issueReason) {
						$scope.issueReasons.splice(i, 1);
					}
				}
			} else {
				$scope.issueReason.$remove(function() {
					$location.path('issue-reasons');
				});
			}
		};

		// Update existing Issue reason
		$scope.update = function() {
			var issueReason = $scope.issueReason;

			issueReason.$update(function() {
				$location.path('issue-reasons/' + issueReason._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Issue reasons
		$scope.find = function() {
			$scope.issueReasons = IssueReasons.query();
		};

		// Find existing Issue reason
		$scope.findOne = function() {
			$scope.issueReason = IssueReasons.get({ 
				issueReasonId: $stateParams.issueReasonId
			});
		};
	}
]);