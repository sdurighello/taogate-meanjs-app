'use strict';

// Financial costs controller
angular.module('financial-costs').controller('FinancialCostsController', ['$scope', '$stateParams', '$location', 'Authentication', 'FinancialCosts',
	function($scope, $stateParams, $location, Authentication, FinancialCosts) {
		$scope.authentication = Authentication;

		// Create new Financial cost
		$scope.create = function() {
			// Create new Financial cost object
			var financialCost = new FinancialCosts ({
				name: this.name
			});

			// Redirect after save
			financialCost.$save(function(response) {
				$location.path('financial-costs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Financial cost
		$scope.remove = function(financialCost) {
			if ( financialCost ) { 
				financialCost.$remove();

				for (var i in $scope.financialCosts) {
					if ($scope.financialCosts [i] === financialCost) {
						$scope.financialCosts.splice(i, 1);
					}
				}
			} else {
				$scope.financialCost.$remove(function() {
					$location.path('financial-costs');
				});
			}
		};

		// Update existing Financial cost
		$scope.update = function() {
			var financialCost = $scope.financialCost;

			financialCost.$update(function() {
				$location.path('financial-costs/' + financialCost._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Financial costs
		$scope.find = function() {
			$scope.financialCosts = FinancialCosts.query();
		};

		// Find existing Financial cost
		$scope.findOne = function() {
			$scope.financialCost = FinancialCosts.get({ 
				financialCostId: $stateParams.financialCostId
			});
		};
	}
]);