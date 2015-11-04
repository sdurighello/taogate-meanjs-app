'use strict';

// Financial benefits controller
angular.module('financial-benefits').controller('FinancialBenefitsController', ['$scope', '$stateParams', '$location', 'Authentication', 'FinancialBenefits',
	function($scope, $stateParams, $location, Authentication, FinancialBenefits) {
		$scope.authentication = Authentication;

		// Create new Financial benefit
		$scope.create = function() {
			// Create new Financial benefit object
			var financialBenefit = new FinancialBenefits ({
				name: this.name
			});

			// Redirect after save
			financialBenefit.$save(function(response) {
				$location.path('financial-benefits/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Financial benefit
		$scope.remove = function(financialBenefit) {
			if ( financialBenefit ) { 
				financialBenefit.$remove();

				for (var i in $scope.financialBenefits) {
					if ($scope.financialBenefits [i] === financialBenefit) {
						$scope.financialBenefits.splice(i, 1);
					}
				}
			} else {
				$scope.financialBenefit.$remove(function() {
					$location.path('financial-benefits');
				});
			}
		};

		// Update existing Financial benefit
		$scope.update = function() {
			var financialBenefit = $scope.financialBenefit;

			financialBenefit.$update(function() {
				$location.path('financial-benefits/' + financialBenefit._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Financial benefits
		$scope.find = function() {
			$scope.financialBenefits = FinancialBenefits.query();
		};

		// Find existing Financial benefit
		$scope.findOne = function() {
			$scope.financialBenefit = FinancialBenefits.get({ 
				financialBenefitId: $stateParams.financialBenefitId
			});
		};
	}
]);