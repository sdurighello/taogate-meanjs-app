'use strict';

// Financial benefit types controller
angular.module('financial-benefit-types').controller('FinancialBenefitTypesController', ['$scope', '$stateParams', '$location', 'Authentication', 'FinancialBenefitTypes',
	function($scope, $stateParams, $location, Authentication, FinancialBenefitTypes) {
		$scope.authentication = Authentication;

		// Create new Financial benefit type
		$scope.create = function() {
			// Create new Financial benefit type object
			var financialBenefitType = new FinancialBenefitTypes ({
				name: this.name
			});

			// Redirect after save
			financialBenefitType.$save(function(response) {
				$location.path('financial-benefit-types/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Financial benefit type
		$scope.remove = function(financialBenefitType) {
			if ( financialBenefitType ) { 
				financialBenefitType.$remove();

				for (var i in $scope.financialBenefitTypes) {
					if ($scope.financialBenefitTypes [i] === financialBenefitType) {
						$scope.financialBenefitTypes.splice(i, 1);
					}
				}
			} else {
				$scope.financialBenefitType.$remove(function() {
					$location.path('financial-benefit-types');
				});
			}
		};

		// Update existing Financial benefit type
		$scope.update = function() {
			var financialBenefitType = $scope.financialBenefitType;

			financialBenefitType.$update(function() {
				$location.path('financial-benefit-types/' + financialBenefitType._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Financial benefit types
		$scope.find = function() {
			$scope.financialBenefitTypes = FinancialBenefitTypes.query();
		};

		// Find existing Financial benefit type
		$scope.findOne = function() {
			$scope.financialBenefitType = FinancialBenefitTypes.get({ 
				financialBenefitTypeId: $stateParams.financialBenefitTypeId
			});
		};
	}
]);