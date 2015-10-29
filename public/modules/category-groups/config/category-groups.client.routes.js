'use strict';

//Setting up route
angular.module('category-groups').config(['$stateProvider',
	function($stateProvider) {
		// Category groups state routing
		$stateProvider.
		state('listCategoryGroups', {
			url: '/category-groups',
			templateUrl: 'modules/category-groups/views/list-category-groups.client.view.html'
		}).
		state('createCategoryGroup', {
			url: '/category-groups/create',
			templateUrl: 'modules/category-groups/views/create-category-group.client.view.html'
		}).
		state('viewCategoryGroup', {
			url: '/category-groups/:categoryGroupId',
			templateUrl: 'modules/category-groups/views/view-category-group.client.view.html'
		}).
		state('editCategoryGroup', {
			url: '/category-groups/:categoryGroupId/edit',
			templateUrl: 'modules/category-groups/views/edit-category-group.client.view.html'
		});
	}
]);