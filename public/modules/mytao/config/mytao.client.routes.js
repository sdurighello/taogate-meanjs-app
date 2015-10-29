'use strict';

//Setting up route
angular.module('mytao').config(['$stateProvider',
	function($stateProvider) {
		// Mytao state routing
		$stateProvider.
		state('mytao', {
			url: '/mytao',
			templateUrl: 'modules/mytao/views/mytao.client.view.html'
		});
	}
]);