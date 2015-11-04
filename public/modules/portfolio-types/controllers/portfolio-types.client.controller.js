'use strict';

// Portfolio types controller
angular.module('portfolio-types').controller('PortfolioTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'PortfolioTypes',
	function($scope, $stateParams, $location, Authentication, PortfolioTypes) {
		$scope.authentication = Authentication;

		// Create new Portfolio type
		$scope.create = function() {
			// Create new Portfolio type object
			var portfolioType = new PortfolioTypes ({
				name: this.name
			});

			// Redirect after save
			portfolioType.$save(function(response) {
				$location.path('portfolio-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Portfolio type
		$scope.remove = function(portfolioType) {
			if ( portfolioType ) { 
				portfolioType.$remove();

				for (var i in $scope.portfolioTypes) {
					if ($scope.portfolioTypes [i] === portfolioType) {
						$scope.portfolioTypes.splice(i, 1);
					}
				}
			} else {
				$scope.portfolioType.$remove(function() {
					$location.path('portfolio-types');
				});
			}
		};

		// Update existing Portfolio type
		$scope.update = function() {
			var portfolioType = $scope.portfolioType;

			portfolioType.$update(function() {
				$location.path('portfolio-types/' + portfolioType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Portfolio types
		$scope.find = function() {
			$scope.portfolioTypes = PortfolioTypes.query();
		};

		// Find existing Portfolio type
		$scope.findOne = function() {
			$scope.portfolioType = PortfolioTypes.get({ 
				portfolioTypeId: $stateParams.portfolioTypeId
			});
		};
	}
]);