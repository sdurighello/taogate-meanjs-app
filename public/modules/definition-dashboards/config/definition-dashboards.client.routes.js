'use strict';

//Setting up route
angular.module('definition-dashboards').config(['$stateProvider',
	function($stateProvider) {
		// Definition dashboards state routing
		$stateProvider.
		state('definition-dashboards', {
			url: '/definition-dashboards',
			templateUrl: 'modules/definition-dashboards/views/definition-dashboards.client.view.html'
		});
	}
]);
