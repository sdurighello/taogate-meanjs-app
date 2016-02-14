'use strict';

//Setting up route
angular.module('category-assignment').config(['$stateProvider',
	function($stateProvider) {
		// Category assignment state routing
		$stateProvider.
		state('categorization-overview', {
			url: '/categorization-overview',
			templateUrl: 'modules/category-assignment/views/categorization-overview.client.view.html'
		}).
		state('category-assignment', {
			url: '/category-assignment',
			templateUrl: 'modules/category-assignment/views/category-assignment.client.view.html'
		});
	}
]);