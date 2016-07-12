'use strict';

angular.module('users').controller('AuthenticationController', ['$rootScope', '$scope', '$http', '$location', 'Authentication',
	function($rootScope, $scope, $http, $location, Authentication) {

        $rootScope.staticMenu = true;
        
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

        // Set default checkbox for seed data
        $scope.credentials = {};
        $scope.credentials.seedData = true;

		$scope.signup = function() {
            $scope.isResolving = true;
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
                $scope.isResolving = false;

				// And redirect to the index page
				$location.path('/mytao');
			}).error(function(response) {
				$scope.error = response.message;
                $scope.isResolving = false;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/mytao');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
