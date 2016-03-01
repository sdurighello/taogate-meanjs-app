'use strict';


angular.module('core').controller('HomeController', ['$scope','$rootScope', 'Authentication',
	function($scope, $rootScope, Authentication) {

		// This provides Authentication context.
		$scope.authentication = Authentication;

        // Hide the app menu and show only the static website navigation
        $rootScope.staticMenu = true;


	}
]);
