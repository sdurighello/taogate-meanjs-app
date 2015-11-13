'use strict';

// People project groups controller
angular.module('people-project-groups').controller('PeopleProjectGroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'PeopleProjectGroups',
	function($scope, $stateParams, $location, Authentication, PeopleProjectGroups) {
		$scope.authentication = Authentication;

		// Create new People project group
		$scope.create = function() {
			// Create new People project group object
			var peopleProjectGroup = new PeopleProjectGroups ({
				name: this.name
			});

			// Redirect after save
			peopleProjectGroup.$save(function(response) {
				$location.path('people-project-groups/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing People project group
		$scope.remove = function(peopleProjectGroup) {
			if ( peopleProjectGroup ) { 
				peopleProjectGroup.$remove();

				for (var i in $scope.peopleProjectGroups) {
					if ($scope.peopleProjectGroups [i] === peopleProjectGroup) {
						$scope.peopleProjectGroups.splice(i, 1);
					}
				}
			} else {
				$scope.peopleProjectGroup.$remove(function() {
					$location.path('people-project-groups');
				});
			}
		};

		// Update existing People project group
		$scope.update = function() {
			var peopleProjectGroup = $scope.peopleProjectGroup;

			peopleProjectGroup.$update(function() {
				$location.path('people-project-groups/' + peopleProjectGroup._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of People project groups
		$scope.find = function() {
			$scope.peopleProjectGroups = PeopleProjectGroups.query();
		};

		// Find existing People project group
		$scope.findOne = function() {
			$scope.peopleProjectGroup = PeopleProjectGroups.get({ 
				peopleProjectGroupId: $stateParams.peopleProjectGroupId
			});
		};
	}
]);