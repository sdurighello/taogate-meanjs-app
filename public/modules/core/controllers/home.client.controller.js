'use strict';


angular.module('core').controller('HomeController', ['$scope','$rootScope', 'Authentication', '$stateParams','_','$anchorScroll','$location',
	function($scope, $rootScope, Authentication, $stateParams, _, $anchorScroll, $location) {



		// This provides Authentication context.
		$scope.authentication = Authentication;

		

		$scope.goToRegistrationForm = function(){
				$location.hash('mc_embed_signup');
				$anchorScroll();
		};


	}
]);
