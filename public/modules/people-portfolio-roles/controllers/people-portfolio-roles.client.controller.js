'use strict';

// People portfolio roles controller
angular.module('people-portfolio-roles').controller('PeoplePortfolioRolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'PeoplePortfolioRoles',
	function($scope, $stateParams, $location, Authentication, PeoplePortfolioRoles) {
		$scope.authentication = Authentication;

		// Create new People portfolio role
		$scope.create = function() {
			// Create new People portfolio role object
			var peoplePortfolioRole = new PeoplePortfolioRoles ({
				name: this.name
			});

			// Redirect after save
			peoplePortfolioRole.$save(function(response) {
				$location.path('people-portfolio-roles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing People portfolio role
		$scope.remove = function(peoplePortfolioRole) {
			if ( peoplePortfolioRole ) { 
				peoplePortfolioRole.$remove();

				for (var i in $scope.peoplePortfolioRoles) {
					if ($scope.peoplePortfolioRoles [i] === peoplePortfolioRole) {
						$scope.peoplePortfolioRoles.splice(i, 1);
					}
				}
			} else {
				$scope.peoplePortfolioRole.$remove(function() {
					$location.path('people-portfolio-roles');
				});
			}
		};

		// Update existing People portfolio role
		$scope.update = function() {
			var peoplePortfolioRole = $scope.peoplePortfolioRole;

			peoplePortfolioRole.$update(function() {
				$location.path('people-portfolio-roles/' + peoplePortfolioRole._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of People portfolio roles
		$scope.find = function() {
			$scope.peoplePortfolioRoles = PeoplePortfolioRoles.query();
		};

		// Find existing People portfolio role
		$scope.findOne = function() {
			$scope.peoplePortfolioRole = PeoplePortfolioRoles.get({ 
				peoplePortfolioRoleId: $stateParams.peoplePortfolioRoleId
			});
		};
	}
]);