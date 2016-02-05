'use strict';

//Setting up route
angular.module('evaluation-dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Evaluation dashboards state routing
		$stateProvider
            .state('dashboard-qualitative', {
			url: '/dashboard-qualitative',
			templateUrl: 'modules/evaluation-dashboards/views/dashboard-qualitative.client.view.html'
            })
            .state('dashboard-financial', {
				url: '/dashboard-financial',
				templateUrl: 'modules/evaluation-dashboards/views/dashboard-financial.client.view.html'
			})
            .state('dashboard-stakeholders', {
                url: '/dashboard-stakeholders',
                templateUrl: 'modules/evaluation-dashboards/views/dashboard-stakeholders.client.view.html'
            });
	}
]);
