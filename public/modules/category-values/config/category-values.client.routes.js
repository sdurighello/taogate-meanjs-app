'use strict';

//Setting up route
angular.module('category-values').config(['$stateProvider',
	function($stateProvider) {
		// Category values state routing
		$stateProvider.
		state('listCategoryValues', {
			url: '/category-values',
			templateUrl: 'modules/category-values/views/list-category-values.client.view.html'
		}).
		state('createCategoryValue', {
			url: '/category-values/create',
			templateUrl: 'modules/category-values/views/create-category-value.client.view.html'
		}).
		state('viewCategoryValue', {
			url: '/category-values/:categoryValueId',
			templateUrl: 'modules/category-values/views/view-category-value.client.view.html'
		}).
		state('editCategoryValue', {
			url: '/category-values/:categoryValueId/edit',
			templateUrl: 'modules/category-values/views/edit-category-value.client.view.html'
		});
	}
]);