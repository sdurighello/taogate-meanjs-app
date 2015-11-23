'use strict';

// Financial cost types controller
angular.module('financial-cost-types').controller('FinancialCostTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'FinancialCostTypes',
	function($scope, $stateParams, $location, Authentication, FinancialCostTypes) {
		$scope.authentication = Authentication;

		// Create new Financial cost type
		$scope.create = function() {
			// Create new Financial cost type object
			var financialCostType = new FinancialCostTypes ({
				name: this.name
			});

			// Redirect after save
			financialCostType.$save(function(response) {
				$location.path('financial-cost-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Financial cost type
		$scope.remove = function(financialCostType) {
			if ( financialCostType ) { 
				financialCostType.$remove();

				for (var i in $scope.financialCostTypes) {
					if ($scope.financialCostTypes [i] === financialCostType) {
						$scope.financialCostTypes.splice(i, 1);
					}
				}
			} else {
				$scope.financialCostType.$remove(function() {
					$location.path('financial-cost-types');
				});
			}
		};

		// Update existing Financial cost type
		$scope.update = function() {
			var financialCostType = $scope.financialCostType;

			financialCostType.$update(function() {
				$location.path('financial-cost-types/' + financialCostType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Financial cost types
		$scope.find = function() {
			$scope.financialCostTypes = FinancialCostTypes.query();
		};

		// Find existing Financial cost type
		$scope.findOne = function() {
			$scope.financialCostType = FinancialCostTypes.get({ 
				financialCostTypeId: $stateParams.financialCostTypeId
			});
		};
	}
]);