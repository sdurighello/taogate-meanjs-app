'use strict';

// Qualitative impact groups controller
angular.module('qualitative-impact-groups').controller('QualitativeImpactGroupsController', ['$scope', '$stateParams', '$location', 'Authentication', 'QualitativeImpactGroups',
	function($scope, $stateParams, $location, Authentication, QualitativeImpactGroups) {
		$scope.authentication = Authentication;

		// Create new Qualitative impact group
		$scope.create = function() {
			// Create new Qualitative impact group object
			var qualitativeImpactGroup = new QualitativeImpactGroups ({
				name: this.name
			});

			// Redirect after save
			qualitativeImpactGroup.$save(function(response) {
				$location.path('qualitative-impact-groups/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Qualitative impact group
		$scope.remove = function(qualitativeImpactGroup) {
			if ( qualitativeImpactGroup ) { 
				qualitativeImpactGroup.$remove();

				for (var i in $scope.qualitativeImpactGroups) {
					if ($scope.qualitativeImpactGroups [i] === qualitativeImpactGroup) {
						$scope.qualitativeImpactGroups.splice(i, 1);
					}
				}
			} else {
				$scope.qualitativeImpactGroup.$remove(function() {
					$location.path('qualitative-impact-groups');
				});
			}
		};

		// Update existing Qualitative impact group
		$scope.update = function() {
			var qualitativeImpactGroup = $scope.qualitativeImpactGroup;

			qualitativeImpactGroup.$update(function() {
				$location.path('qualitative-impact-groups/' + qualitativeImpactGroup._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Qualitative impact groups
		$scope.find = function() {
			$scope.qualitativeImpactGroups = QualitativeImpactGroups.query();
		};

		// Find existing Qualitative impact group
		$scope.findOne = function() {
			$scope.qualitativeImpactGroup = QualitativeImpactGroups.get({ 
				qualitativeImpactGroupId: $stateParams.qualitativeImpactGroupId
			});
		};
	}
]);