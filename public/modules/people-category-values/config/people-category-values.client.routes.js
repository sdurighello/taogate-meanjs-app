'use strict';

//Setting up route
angular.module('people-category-values').config(['$stateProvider',
	function($stateProvider) {
		// People category values state routing
		$stateProvider.
		state('listPeopleCategoryValues', {
			url: '/people-category-values',
			templateUrl: 'modules/people-category-values/views/list-people-category-values.client.view.html'
		}).
		state('createPeopleCategoryValue', {
			url: '/people-category-values/create',
			templateUrl: 'modules/people-category-values/views/create-people-category-value.client.view.html'
		}).
		state('viewPeopleCategoryValue', {
			url: '/people-category-values/:peopleCategoryValueId',
			templateUrl: 'modules/people-category-values/views/view-people-category-value.client.view.html'
		}).
		state('editPeopleCategoryValue', {
			url: '/people-category-values/:peopleCategoryValueId/edit',
			templateUrl: 'modules/people-category-values/views/edit-people-category-value.client.view.html'
		});
	}
]);