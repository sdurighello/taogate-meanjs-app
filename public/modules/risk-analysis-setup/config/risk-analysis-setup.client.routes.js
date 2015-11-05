'use strict';

//Setting up route
angular.module('risk-analysis-setup').config(['$stateProvider',
	function($stateProvider) {
		// Risk analysis setup state routing
		$stateProvider.
		state('risk-analysis-setup', {
			url: '/risk-analysis-setup',
			templateUrl: 'modules/risk-analysis-setup/views/risk-analysis-setup.client.view.html'
		});
	}
]);