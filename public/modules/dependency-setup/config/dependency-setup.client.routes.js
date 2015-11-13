'use strict';

//Setting up route
angular.module('dependency-setup').config(['$stateProvider',
	function($stateProvider) {
		// Dependency setup state routing
		$stateProvider.
		state('dependency-setup', {
			url: '/dependency-setup',
			templateUrl: 'modules/dependency-setup/views/dependency-setup.client.view.html'
		});
	}
]);