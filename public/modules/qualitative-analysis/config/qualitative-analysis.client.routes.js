'use strict';

//Setting up route
angular.module('qualitative-analysis').config(['$stateProvider',
	function($stateProvider) {
		// Qualitative analysis state routing
		$stateProvider.
		state('qualitative-analysis', {
			url: '/qualitative-analysis',
			templateUrl: 'modules/qualitative-analysis/views/qualitative-analysis.client.view.html'
		});
	}
]);