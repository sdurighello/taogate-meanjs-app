'use strict';

//Setting up route
angular.module('dependencies').config(['$stateProvider',
	function($stateProvider) {
		// Dependencies state routing
		$stateProvider.
		state('listDependencies', {
			url: '/dependencies',
			templateUrl: 'modules/dependencies/views/list-dependencies.client.view.html'
		}).
		state('createDependency', {
			url: '/dependencies/create',
			templateUrl: 'modules/dependencies/views/create-dependency.client.view.html'
		}).
		state('viewDependency', {
			url: '/dependencies/:dependencyId',
			templateUrl: 'modules/dependencies/views/view-dependency.client.view.html'
		}).
		state('editDependency', {
			url: '/dependencies/:dependencyId/edit',
			templateUrl: 'modules/dependencies/views/edit-dependency.client.view.html'
		});
	}
]);