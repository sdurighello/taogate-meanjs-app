'use strict';

// Portfolio rankings controller
angular.module('portfolio-rankings').controller('PortfolioRankingsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PortfolioRankings',
	function($scope, $stateParams, $location, Authentication, PortfolioRankings) {
		$scope.authentication = Authentication;

		// Create new Portfolio ranking
		$scope.create = function() {
			// Create new Portfolio ranking object
			var portfolioRanking = new PortfolioRankings ({
				name: this.name
			});

			// Redirect after save
			portfolioRanking.$save(function(response) {
				$location.path('portfolio-rankings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Portfolio ranking
		$scope.remove = function(portfolioRanking) {
			if ( portfolioRanking ) { 
				portfolioRanking.$remove();

				for (var i in $scope.portfolioRankings) {
					if ($scope.portfolioRankings [i] === portfolioRanking) {
						$scope.portfolioRankings.splice(i, 1);
					}
				}
			} else {
				$scope.portfolioRanking.$remove(function() {
					$location.path('portfolio-rankings');
				});
			}
		};

		// Update existing Portfolio ranking
		$scope.update = function() {
			var portfolioRanking = $scope.portfolioRanking;

			portfolioRanking.$update(function() {
				$location.path('portfolio-rankings/' + portfolioRanking._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Portfolio rankings
		$scope.find = function() {
			$scope.portfolioRankings = PortfolioRankings.query();
		};

		// Find existing Portfolio ranking
		$scope.findOne = function() {
			$scope.portfolioRanking = PortfolioRankings.get({ 
				portfolioRankingId: $stateParams.portfolioRankingId
			});
		};
	}
]);