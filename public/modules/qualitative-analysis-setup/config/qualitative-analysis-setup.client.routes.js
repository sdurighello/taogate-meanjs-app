'use strict';

//Setting up route
angular.module('qualitative-analysis-setup').config(['$stateProvider',
	function($stateProvider) {
		// Qualitative analysis setup state routing
		$stateProvider.
		state('qualitative-analysis-setup', {
			url: '/qualitative-analysis-setup',
			templateUrl: 'modules/qualitative-analysis-setup/views/qualitative-analysis-setup.client.view.html'
		});
	}
]);