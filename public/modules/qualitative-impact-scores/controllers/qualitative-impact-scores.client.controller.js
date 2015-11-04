'use strict';

// Qualitative impact scores controller
angular.module('qualitative-impact-scores').controller('QualitativeImpactScoresController', ['$scope', '$stateParams', '$location', 'Authentication', 'QualitativeImpactScores',
	function($scope, $stateParams, $location, Authentication, QualitativeImpactScores) {
		$scope.authentication = Authentication;

		// Create new Qualitative impact score
		$scope.create = function() {
			// Create new Qualitative impact score object
			var qualitativeImpactScore = new QualitativeImpactScores ({
				name: this.name
			});

			// Redirect after save
			qualitativeImpactScore.$save(function(response) {
				$location.path('qualitative-impact-scores/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Qualitative impact score
		$scope.remove = function(qualitativeImpactScore) {
			if ( qualitativeImpactScore ) { 
				qualitativeImpactScore.$remove();

				for (var i in $scope.qualitativeImpactScores) {
					if ($scope.qualitativeImpactScores [i] === qualitativeImpactScore) {
						$scope.qualitativeImpactScores.splice(i, 1);
					}
				}
			} else {
				$scope.qualitativeImpactScore.$remove(function() {
					$location.path('qualitative-impact-scores');
				});
			}
		};

		// Update existing Qualitative impact score
		$scope.update = function() {
			var qualitativeImpactScore = $scope.qualitativeImpactScore;

			qualitativeImpactScore.$update(function() {
				$location.path('qualitative-impact-scores/' + qualitativeImpactScore._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Qualitative impact scores
		$scope.find = function() {
			$scope.qualitativeImpactScores = QualitativeImpactScores.query();
		};

		// Find existing Qualitative impact score
		$scope.findOne = function() {
			$scope.qualitativeImpactScore = QualitativeImpactScores.get({ 
				qualitativeImpactScoreId: $stateParams.qualitativeImpactScoreId
			});
		};
	}
]);