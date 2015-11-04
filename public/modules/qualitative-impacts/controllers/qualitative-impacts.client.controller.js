'use strict';

// Qualitative impacts controller
angular.module('qualitative-impacts').controller('QualitativeImpactsController', ['$scope', '$stateParams', '$location', 'Authentication', 'QualitativeImpacts',
	function($scope, $stateParams, $location, Authentication, QualitativeImpacts) {
		$scope.authentication = Authentication;

		// Create new Qualitative impact
		$scope.create = function() {
			// Create new Qualitative impact object
			var qualitativeImpact = new QualitativeImpacts ({
				name: this.name
			});

			// Redirect after save
			qualitativeImpact.$save(function(response) {
				$location.path('qualitative-impacts/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Qualitative impact
		$scope.remove = function(qualitativeImpact) {
			if ( qualitativeImpact ) { 
				qualitativeImpact.$remove();

				for (var i in $scope.qualitativeImpacts) {
					if ($scope.qualitativeImpacts [i] === qualitativeImpact) {
						$scope.qualitativeImpacts.splice(i, 1);
					}
				}
			} else {
				$scope.qualitativeImpact.$remove(function() {
					$location.path('qualitative-impacts');
				});
			}
		};

		// Update existing Qualitative impact
		$scope.update = function() {
			var qualitativeImpact = $scope.qualitativeImpact;

			qualitativeImpact.$update(function() {
				$location.path('qualitative-impacts/' + qualitativeImpact._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Qualitative impacts
		$scope.find = function() {
			$scope.qualitativeImpacts = QualitativeImpacts.query();
		};

		// Find existing Qualitative impact
		$scope.findOne = function() {
			$scope.qualitativeImpact = QualitativeImpacts.get({ 
				qualitativeImpactId: $stateParams.qualitativeImpactId
			});
		};
	}
]);