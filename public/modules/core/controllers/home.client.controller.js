'use strict';


angular.module('core').controller('HomeController', ['$scope','$rootScope', 'Authentication',
	function($scope, $rootScope, Authentication) {

		// This provides Authentication context.
		$scope.authentication = Authentication;

        // Hide the app menu and show only the static website navigation
        $rootScope.staticMenu = true;

        // METHODOLOGY NG-INCLUDES

        $scope.setTemplate = function(partial){
            // Overview
            if(partial === 'overview'){
                $scope.includeTemplate = 'modules/core/views/method/overview.client.view.html';
            }
            // Definition
            if(partial === 'strategy-decomposition'){
                $scope.includeTemplate = 'modules/core/views/method/strategy-decomposition.client.view.html';
            }
            if(partial === 'portfolio-structure'){
                $scope.includeTemplate = 'modules/core/views/method/portfolio-structure.client.view.html';
            }
            if(partial === 'identification'){
                $scope.includeTemplate = 'modules/core/views/method/identification.client.view.html';
            }
            if(partial === 'categorization'){
                $scope.includeTemplate = 'modules/core/views/method/categorization.client.view.html';
            }
            if(partial === 'prioritization'){
                $scope.includeTemplate = 'modules/core/views/method/prioritization.client.view.html';
            }
            // Evaluation
            if(partial === 'financial-analysis'){
                $scope.includeTemplate = 'modules/core/views/method/financial-analysis.client.view.html';
            }
            if(partial === 'qualitative-analysis'){
                $scope.includeTemplate = 'modules/core/views/method/qualitative-analysis.client.view.html';
            }
            if(partial === 'risk-analysis'){
                $scope.includeTemplate = 'modules/core/views/method/risk-analysis.client.view.html';
            }
            if(partial === 'stakeholder-management'){
                $scope.includeTemplate = 'modules/core/views/method/stakeholder-management.client.view.html';
            }
            if(partial === 'review'){
                $scope.includeTemplate = 'modules/core/views/method/review.client.view.html';
            }
            // Delivery
            if(partial === 'gate-management'){
                $scope.includeTemplate = 'modules/core/views/method/gate-management.client.view.html';
            }
            if(partial === 'change-management'){
                $scope.includeTemplate = 'modules/core/views/method/change-management.client.view.html';
            }
            if(partial === 'issues'){
                $scope.includeTemplate = 'modules/core/views/method/issues.client.view.html';
            }
            if(partial === 'milestones'){
                $scope.includeTemplate = 'modules/core/views/method/milestones.client.view.html';
            }
            if(partial === 'status'){
                $scope.includeTemplate = 'modules/core/views/method/status.client.view.html';
            }
            // Roles and responsibilities
            if(partial === 'governance-groups'){
                $scope.includeTemplate = 'modules/core/views/method/governance-groups.client.view.html';
            }
            if(partial === 'roles'){
                $scope.includeTemplate = 'modules/core/views/method/roles.client.view.html';
            }
        };
        // set default template
        $scope.setTemplate('overview');


	}
]);
