'use strict';

// People portfolio groups controller
angular.module('people-portfolio-groups').controller('PeoplePortfolioGroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PeoplePortfolioGroups',
	function($scope, $stateParams, $location, Authentication, PeoplePortfolioGroups) {
		$scope.authentication = Authentication;

		// Create new People portfolio group
		$scope.create = function() {
			// Create new People portfolio group object
			var peoplePortfolioGroup = new PeoplePortfolioGroups ({
				name: this.name
			});

			// Redirect after save
			peoplePortfolioGroup.$save(function(response) {
				$location.path('people-portfolio-groups/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing People portfolio group
		$scope.remove = function(peoplePortfolioGroup) {
			if ( peoplePortfolioGroup ) { 
				peoplePortfolioGroup.$remove();

				for (var i in $scope.peoplePortfolioGroups) {
					if ($scope.peoplePortfolioGroups [i] === peoplePortfolioGroup) {
						$scope.peoplePortfolioGroups.splice(i, 1);
					}
				}
			} else {
				$scope.peoplePortfolioGroup.$remove(function() {
					$location.path('people-portfolio-groups');
				});
			}
		};

		// Update existing People portfolio group
		$scope.update = function() {
			var peoplePortfolioGroup = $scope.peoplePortfolioGroup;

			peoplePortfolioGroup.$update(function() {
				$location.path('people-portfolio-groups/' + peoplePortfolioGroup._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of People portfolio groups
		$scope.find = function() {
			$scope.peoplePortfolioGroups = PeoplePortfolioGroups.query();
		};

		// Find existing People portfolio group
		$scope.findOne = function() {
			$scope.peoplePortfolioGroup = PeoplePortfolioGroups.get({ 
				peoplePortfolioGroupId: $stateParams.peoplePortfolioGroupId
			});
		};
	}
]);