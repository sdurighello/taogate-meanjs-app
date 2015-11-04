'use strict';

// Financial benefit groups controller
angular.module('financial-benefit-groups').controller('FinancialBenefitGroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'FinancialBenefitGroups',
	function($scope, $stateParams, $location, Authentication, FinancialBenefitGroups) {
		$scope.authentication = Authentication;

		// Create new Financial benefit group
		$scope.create = function() {
			// Create new Financial benefit group object
			var financialBenefitGroup = new FinancialBenefitGroups ({
				name: this.name
			});

			// Redirect after save
			financialBenefitGroup.$save(function(response) {
				$location.path('financial-benefit-groups/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Financial benefit group
		$scope.remove = function(financialBenefitGroup) {
			if ( financialBenefitGroup ) { 
				financialBenefitGroup.$remove();

				for (var i in $scope.financialBenefitGroups) {
					if ($scope.financialBenefitGroups [i] === financialBenefitGroup) {
						$scope.financialBenefitGroups.splice(i, 1);
					}
				}
			} else {
				$scope.financialBenefitGroup.$remove(function() {
					$location.path('financial-benefit-groups');
				});
			}
		};

		// Update existing Financial benefit group
		$scope.update = function() {
			var financialBenefitGroup = $scope.financialBenefitGroup;

			financialBenefitGroup.$update(function() {
				$location.path('financial-benefit-groups/' + financialBenefitGroup._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Financial benefit groups
		$scope.find = function() {
			$scope.financialBenefitGroups = FinancialBenefitGroups.query();
		};

		// Find existing Financial benefit group
		$scope.findOne = function() {
			$scope.financialBenefitGroup = FinancialBenefitGroups.get({ 
				financialBenefitGroupId: $stateParams.financialBenefitGroupId
			});
		};
	}
]);