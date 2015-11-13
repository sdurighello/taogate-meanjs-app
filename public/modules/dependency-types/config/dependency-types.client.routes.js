'use strict';

//Setting up route
angular.module('dependency-types').config(['$stateProvider',
	function($stateProvider) {
		// Dependency types state routing
		$stateProvider.
		state('listDependencyTypes', {
			url: '/dependency-types',
			templateUrl: 'modules/dependency-types/views/list-dependency-types.client.view.html'
		}).
		state('createDependencyType', {
			url: '/dependency-types/create',
			templateUrl: 'modules/dependency-types/views/create-dependency-type.client.view.html'
		}).
		state('viewDependencyType', {
			url: '/dependency-types/:dependencyTypeId',
			templateUrl: 'modules/dependency-types/views/view-dependency-type.client.view.html'
		}).
		state('editDependencyType', {
			url: '/dependency-types/:dependencyTypeId/edit',
			templateUrl: 'modules/dependency-types/views/edit-dependency-type.client.view.html'
		});
	}
]);