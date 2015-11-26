'use strict';

//Setting up route
angular.module('risk-analysis').config(['$stateProvider',
	function($stateProvider) {
		// Risk analysis state routing
		$stateProvider.
		state('risk-analysis', {
			url: '/risk-analysis',
			templateUrl: 'modules/risk-analysis/views/risk-analysis.client.view.html'
		});
	}
]);