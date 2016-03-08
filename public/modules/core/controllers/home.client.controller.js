'use strict';


angular.module('core').controller('HomeController', ['$scope','$rootScope', 'Authentication', '$stateParams','_','$anchorScroll','$location',
	function($scope, $rootScope, Authentication, $stateParams, _, $anchorScroll, $location) {

        // init main "Methodology" page
        $scope.init = function(){
            if($stateParams){
                var partial = $stateParams.sectionName;
                if(partial){
                    $scope.setTemplate(partial);
                } else {
                    // set default template ng-if
                    $scope.setTemplate('overview');
                }
            }
        };

        // Init article pages
        $scope.initArticle = function(){
            $location.hash('top');
            $anchorScroll();
        };


		// This provides Authentication context.
		$scope.authentication = Authentication;

        // Hide the app menu and show only the static website navigation
        $rootScope.staticMenu = true;

        // Hide/show method menu
        $scope.showKnowledgeAreas = true;

        // ----------- Methodology section --------------

        $scope.setTemplate = function(partial){
            $scope.includeTemplate = partial;
            $location.hash('top');
            $anchorScroll();
        };


	}
]);
