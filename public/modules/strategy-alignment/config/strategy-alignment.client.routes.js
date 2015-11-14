'use strict';

//Setting up route
angular.module('strategy-alignment').config(['$stateProvider',
	function($stateProvider) {
		// Strategy alignment state routing
		$stateProvider.
		state('strategy-alignment', {
			url: '/strategy-alignment',
			templateUrl: 'modules/strategy-alignment/views/strategy-alignment.client.view.html'
		});
	}
]);