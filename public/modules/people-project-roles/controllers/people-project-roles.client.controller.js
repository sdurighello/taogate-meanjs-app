'use strict';

// People project roles controller
angular.module('people-project-roles').controller('PeopleProjectRolesController', ['$scope', '$stateParams', '$location', 'Authentication', 'PeopleProjectRoles',
	function($scope, $stateParams, $location, Authentication, PeopleProjectRoles) {
		$scope.authentication = Authentication;

		// Create new People project role
		$scope.create = function() {
			// Create new People project role object
			var peopleProjectRole = new PeopleProjectRoles ({
				name: this.name
			});

			// Redirect after save
			peopleProjectRole.$save(function(response) {
				$location.path('people-project-roles/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing People project role
		$scope.remove = function(peopleProjectRole) {
			if ( peopleProjectRole ) { 
				peopleProjectRole.$remove();

				for (var i in $scope.peopleProjectRoles) {
					if ($scope.peopleProjectRoles [i] === peopleProjectRole) {
						$scope.peopleProjectRoles.splice(i, 1);
					}
				}
			} else {
				$scope.peopleProjectRole.$remove(function() {
					$location.path('people-project-roles');
				});
			}
		};

		// Update existing People project role
		$scope.update = function() {
			var peopleProjectRole = $scope.peopleProjectRole;

			peopleProjectRole.$update(function() {
				$location.path('people-project-roles/' + peopleProjectRole._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of People project roles
		$scope.find = function() {
			$scope.peopleProjectRoles = PeopleProjectRoles.query();
		};

		// Find existing People project role
		$scope.findOne = function() {
			$scope.peopleProjectRole = PeopleProjectRoles.get({ 
				peopleProjectRoleId: $stateParams.peopleProjectRoleId
			});
		};
	}
]);