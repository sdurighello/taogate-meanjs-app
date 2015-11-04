'use strict';

//Setting up route
angular.module('category-setup').config(['$stateProvider',
	function($stateProvider) {
		// Category setup state routing
		$stateProvider.
		state('category-setup', {
			url: '/category-setup',
			templateUrl: 'modules/category-setup/views/category-setup.client.view.html'
		});
	}
]);