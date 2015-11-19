'use strict';

// Overall rankings controller
angular.module('overall-rankings').controller('OverallRankingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'OverallRankings',
	function($scope, $stateParams, $location, Authentication, OverallRankings) {
		$scope.authentication = Authentication;

		// Create new Overall ranking
		$scope.create = function() {
			// Create new Overall ranking object
			var overallRanking = new OverallRankings ({
				name: this.name
			});

			// Redirect after save
			overallRanking.$save(function(response) {
				$location.path('overall-rankings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Overall ranking
		$scope.remove = function(overallRanking) {
			if ( overallRanking ) { 
				overallRanking.$remove();

				for (var i in $scope.overallRankings) {
					if ($scope.overallRankings [i] === overallRanking) {
						$scope.overallRankings.splice(i, 1);
					}
				}
			} else {
				$scope.overallRanking.$remove(function() {
					$location.path('overall-rankings');
				});
			}
		};

		// Update existing Overall ranking
		$scope.update = function() {
			var overallRanking = $scope.overallRanking;

			overallRanking.$update(function() {
				$location.path('overall-rankings/' + overallRanking._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Overall rankings
		$scope.find = function() {
			$scope.overallRankings = OverallRankings.query();
		};

		// Find existing Overall ranking
		$scope.findOne = function() {
			$scope.overallRanking = OverallRankings.get({ 
				overallRankingId: $stateParams.overallRankingId
			});
		};
	}
]);