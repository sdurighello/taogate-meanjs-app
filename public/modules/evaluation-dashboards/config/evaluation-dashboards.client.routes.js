'use strict';

//Setting up route
angular.module('evaluation-dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Evaluation dashboards state routing
		$stateProvider.
			state('dashboard-financial', {
				url: '/dashboard-financial',
				templateUrl: 'modules/evaluation-dashboards/views/dashboard-financial.client.view.html'
			});
	}
]);
