'use strict';

// People categories controller
angular.module('people-categories').controller('PeopleCategoriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'PeopleCategories',
	function($scope, $stateParams, $location, Authentication, PeopleCategories) {
		$scope.authentication = Authentication;

		// Create new People category
		$scope.create = function() {
			// Create new People category object
			var peopleCategory = new PeopleCategories ({
				name: this.name
			});

			// Redirect after save
			peopleCategory.$save(function(response) {
				$location.path('people-categories/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing People category
		$scope.remove = function(peopleCategory) {
			if ( peopleCategory ) { 
				peopleCategory.$remove();

				for (var i in $scope.peopleCategories) {
					if ($scope.peopleCategories [i] === peopleCategory) {
						$scope.peopleCategories.splice(i, 1);
					}
				}
			} else {
				$scope.peopleCategory.$remove(function() {
					$location.path('people-categories');
				});
			}
		};

		// Update existing People category
		$scope.update = function() {
			var peopleCategory = $scope.peopleCategory;

			peopleCategory.$update(function() {
				$location.path('people-categories/' + peopleCategory._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of People categories
		$scope.find = function() {
			$scope.peopleCategories = PeopleCategories.query();
		};

		// Find existing People category
		$scope.findOne = function() {
			$scope.peopleCategory = PeopleCategories.get({ 
				peopleCategoryId: $stateParams.peopleCategoryId
			});
		};
	}
]);