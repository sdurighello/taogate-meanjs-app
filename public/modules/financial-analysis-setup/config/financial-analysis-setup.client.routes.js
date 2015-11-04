'use strict';

//Setting up route
angular.module('financial-analysis-setup').config(['$stateProvider',
	function($stateProvider) {
		// Financial analysis setup state routing
		$stateProvider.
		state('financial-analysis-setup', {
			url: '/financial-analysis-setup',
			templateUrl: 'modules/financial-analysis-setup/views/financial-analysis-setup.client.view.html'
		});
	}
]);