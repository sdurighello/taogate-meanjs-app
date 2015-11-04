'use strict';

// Financial cost groups controller
angular.module('financial-cost-groups').controller('FinancialCostGroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'FinancialCostGroups',
	function($scope, $stateParams, $location, Authentication, FinancialCostGroups) {
		$scope.authentication = Authentication;

		// Create new Financial cost group
		$scope.create = function() {
			// Create new Financial cost group object
			var financialCostGroup = new FinancialCostGroups ({
				name: this.name
			});

			// Redirect after save
			financialCostGroup.$save(function(response) {
				$location.path('financial-cost-groups/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Financial cost group
		$scope.remove = function(financialCostGroup) {
			if ( financialCostGroup ) { 
				financialCostGroup.$remove();

				for (var i in $scope.financialCostGroups) {
					if ($scope.financialCostGroups [i] === financialCostGroup) {
						$scope.financialCostGroups.splice(i, 1);
					}
				}
			} else {
				$scope.financialCostGroup.$remove(function() {
					$location.path('financial-cost-groups');
				});
			}
		};

		// Update existing Financial cost group
		$scope.update = function() {
			var financialCostGroup = $scope.financialCostGroup;

			financialCostGroup.$update(function() {
				$location.path('financial-cost-groups/' + financialCostGroup._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Financial cost groups
		$scope.find = function() {
			$scope.financialCostGroups = FinancialCostGroups.query();
		};

		// Find existing Financial cost group
		$scope.findOne = function() {
			$scope.financialCostGroup = FinancialCostGroups.get({ 
				financialCostGroupId: $stateParams.financialCostGroupId
			});
		};
	}
]);