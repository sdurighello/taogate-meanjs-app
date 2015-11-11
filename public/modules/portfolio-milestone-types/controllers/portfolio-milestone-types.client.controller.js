'use strict';

// Portfolio milestone types controller
angular.module('portfolio-milestone-types').controller('PortfolioMilestoneTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'PortfolioMilestoneTypes',
	function($scope, $stateParams, $location, Authentication, PortfolioMilestoneTypes) {
		$scope.authentication = Authentication;

		// Create new Portfolio milestone type
		$scope.create = function() {
			// Create new Portfolio milestone type object
			var portfolioMilestoneType = new PortfolioMilestoneTypes ({
				name: this.name
			});

			// Redirect after save
			portfolioMilestoneType.$save(function(response) {
				$location.path('portfolio-milestone-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Portfolio milestone type
		$scope.remove = function(portfolioMilestoneType) {
			if ( portfolioMilestoneType ) { 
				portfolioMilestoneType.$remove();

				for (var i in $scope.portfolioMilestoneTypes) {
					if ($scope.portfolioMilestoneTypes [i] === portfolioMilestoneType) {
						$scope.portfolioMilestoneTypes.splice(i, 1);
					}
				}
			} else {
				$scope.portfolioMilestoneType.$remove(function() {
					$location.path('portfolio-milestone-types');
				});
			}
		};

		// Update existing Portfolio milestone type
		$scope.update = function() {
			var portfolioMilestoneType = $scope.portfolioMilestoneType;

			portfolioMilestoneType.$update(function() {
				$location.path('portfolio-milestone-types/' + portfolioMilestoneType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Portfolio milestone types
		$scope.find = function() {
			$scope.portfolioMilestoneTypes = PortfolioMilestoneTypes.query();
		};

		// Find existing Portfolio milestone type
		$scope.findOne = function() {
			$scope.portfolioMilestoneType = PortfolioMilestoneTypes.get({ 
				portfolioMilestoneTypeId: $stateParams.portfolioMilestoneTypeId
			});
		};
	}
]);