'use strict';

// Risks controller
angular.module('risks').controller('RisksController', ['$scope', '$stateParams', '$location', 'Authentication', 'Risks',
	function($scope, $stateParams, $location, Authentication, Risks) {
		$scope.authentication = Authentication;

		// Create new Risk
		$scope.create = function() {
			// Create new Risk object
			var risk = new Risks ({
				name: this.name
			});

			// Redirect after save
			risk.$save(function(response) {
				$location.path('risks/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Risk
		$scope.remove = function(risk) {
			if ( risk ) { 
				risk.$remove();

				for (var i in $scope.risks) {
					if ($scope.risks [i] === risk) {
						$scope.risks.splice(i, 1);
					}
				}
			} else {
				$scope.risk.$remove(function() {
					$location.path('risks');
				});
			}
		};

		// Update existing Risk
		$scope.update = function() {
			var risk = $scope.risk;

			risk.$update(function() {
				$location.path('risks/' + risk._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Risks
		$scope.find = function() {
			$scope.risks = Risks.query();
		};

		// Find existing Risk
		$scope.findOne = function() {
			$scope.risk = Risks.get({ 
				riskId: $stateParams.riskId
			});
		};
	}
]);