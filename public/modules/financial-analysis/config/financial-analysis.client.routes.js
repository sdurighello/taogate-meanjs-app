'use strict';

//Setting up route
angular.module('financial-analysis').config(['$stateProvider',
	function($stateProvider) {
		// Financial analysis state routing
		$stateProvider.
		state('financial-analysis', {
			url: '/financial-analysis',
			templateUrl: 'modules/financial-analysis/views/financial-analysis.client.view.html'
		});
	}
]);