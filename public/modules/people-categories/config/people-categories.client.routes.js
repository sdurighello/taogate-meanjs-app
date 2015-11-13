'use strict';

//Setting up route
angular.module('people-categories').config(['$stateProvider',
	function($stateProvider) {
		// People categories state routing
		$stateProvider.
		state('listPeopleCategories', {
			url: '/people-categories',
			templateUrl: 'modules/people-categories/views/list-people-categories.client.view.html'
		}).
		state('createPeopleCategory', {
			url: '/people-categories/create',
			templateUrl: 'modules/people-categories/views/create-people-category.client.view.html'
		}).
		state('viewPeopleCategory', {
			url: '/people-categories/:peopleCategoryId',
			templateUrl: 'modules/people-categories/views/view-people-category.client.view.html'
		}).
		state('editPeopleCategory', {
			url: '/people-categories/:peopleCategoryId/edit',
			templateUrl: 'modules/people-categories/views/edit-people-category.client.view.html'
		});
	}
]);