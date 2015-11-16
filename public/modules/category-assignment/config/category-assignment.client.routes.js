'use strict';

//Setting up route
angular.module('category-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Category assignment state routing
		$stateProvider.
		state('category-assignment', {
			url: '/category-assignment',
			templateUrl: 'modules/category-assignment/views/category-assignment.client.view.html'
		});
	}
]);